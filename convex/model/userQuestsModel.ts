import { type Category, STATUS, type Status } from "../../src/constants";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import * as UserQuestPlaceholders from "./userQuestPlaceholdersModel";

export async function getAllForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userQuests = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  const quests = await Promise.all(
    userQuests.map(async (userQuest) => {
      const quest = await ctx.db.get(userQuest.questId);
      return quest && quest.deletedAt === undefined
        ? { ...quest, ...userQuest }
        : null;
    }),
  );

  return quests.filter((quest) => quest !== null);
}

export async function getByQuestIdsForUser(
  ctx: QueryCtx,
  { userId, questIds }: { userId: Id<"users">; questIds: Id<"quests">[] },
) {
  const userQuests = await getAllForUser(ctx, { userId });
  return userQuests.filter((uq) => questIds.includes(uq.questId));
}

export async function getCountForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  return getAllForUser(ctx, { userId }).then((quests) => quests.length);
}

export async function getAvailableForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userQuests = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  const userQuestIds = userQuests.map((quest) => quest.questId);

  const allActiveQuests = await ctx.db
    .query("quests")
    .filter((q) => q.eq(q.field("deletedAt"), undefined))
    .collect();

  return allActiveQuests.filter((quest) => !userQuestIds.includes(quest._id));
}

export async function getGlobalCount(
  ctx: QueryCtx,
  { questId }: { questId: Id<"quests"> },
) {
  const quests = await ctx.db
    .query("userQuests")
    .withIndex("questId", (q) => q.eq("questId", questId))
    .collect();

  return quests.length;
}

export async function getQuestCounts(
  ctx: QueryCtx,
  { questIds }: { questIds: Id<"quests">[] },
) {
  const counts = await Promise.all(
    questIds.map(async (questId) => {
      const count = await ctx.db
        .query("userQuests")
        .withIndex("questId", (q) => q.eq("questId", questId))
        .collect();
      return { questId, count: count.length };
    }),
  );
  return counts;
}

export async function getCompletedCountForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userQuests = await getAllForUser(ctx, { userId });

  const completedQuests = userQuests.filter(
    (quest) => quest.completedAt !== undefined,
  );

  return completedQuests.length;
}

export async function getByCategoryForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userQuests = await getAllForUser(ctx, { userId });

  const questsWithDetails = await Promise.all(
    userQuests.map(async (userQuest) => {
      const quest = await ctx.db.get(userQuest.questId);
      return quest && quest.deletedAt === undefined
        ? { ...quest, ...userQuest }
        : null;
    }),
  );

  const validQuests = questsWithDetails.filter(
    (q): q is NonNullable<typeof q> => q !== null,
  );

  return validQuests.reduce(
    (acc, quest) => {
      const category = (quest.category ?? "other") as Category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(quest);
      return acc;
    },
    {} as Record<string, typeof validQuests>,
  );
}

export async function createQuestForUser(
  ctx: MutationCtx,
  { userId, questId }: { userId: Id<"users">; questId: Id<"quests"> },
) {
  const existing = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("questId"), questId))
    .collect();

  if (existing.length > 0) throw new Error("Quest already exists for user");

  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  try {
    await UserQuestPlaceholders.dismissPlaceholderForUser(ctx, {
      userId,
      category: quest.category as Category,
    });
  } catch (error) {
    // If no placeholder exists, that's fine. Just continue.
  }

  await ctx.db.insert("userQuests", {
    userId,
    questId,
    status: "notStarted",
  });
}

export async function getByQuestIdForUser(
  ctx: QueryCtx,
  { userId, questId }: { userId: Id<"users">; questId: Id<"quests"> },
) {
  const userQuest = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("questId"), questId))
    .first();

  return userQuest;
}

export async function getQuestStatusForUser(
  ctx: QueryCtx,
  { userId, questId }: { userId: Id<"users">; questId: Id<"quests"> },
) {
  const userQuest = await getByQuestIdForUser(ctx, {
    userId,
    questId,
  });
  if (userQuest === null) throw new Error("Quest not found");
  return userQuest.status;
}

export async function setQuestStatusForUser(
  ctx: MutationCtx,
  {
    userId,
    questId,
    status,
  }: { userId: Id<"users">; questId: Id<"quests">; status: Status },
) {
  const quest = await ctx.db.get(questId);
  if (quest === null) throw new Error("Quest not found");

  const userQuest = await getByQuestIdForUser(ctx, {
    userId,
    questId,
  });
  if (userQuest === null) throw new Error("User quest not found");

  // Throw if status is invalid
  if (!STATUS[status as Status]) throw new Error("Invalid status");

  // Prevent setting the existing status
  if (userQuest.status === status) {
    return;
  }

  // Build the update object based on status transitions
  const update: {
    status: Status;
    startedAt?: number | undefined;
    completedAt?: number | undefined;
  } = {
    status,
  };

  // Handle all status transitions
  switch (status) {
    case "notStarted":
      update.completedAt = undefined;
      break;

    case "inProgress":
      update.startedAt = Date.now();
      if (userQuest.status === "complete") {
        update.completedAt = undefined;
      }
      break;

    case "complete":
      update.completedAt = Date.now();
      break;
  }

  await ctx.db.patch(userQuest._id, update);
}

export async function deleteQuestForUser(
  ctx: MutationCtx,
  { userId, questId }: { userId: Id<"users">; questId: Id<"quests"> },
) {
  const userQuest = await getByQuestIdForUser(ctx, {
    userId,
    questId,
  });
  if (userQuest === null) throw new Error("Quest not found");
  await ctx.db.delete(userQuest._id);
}
