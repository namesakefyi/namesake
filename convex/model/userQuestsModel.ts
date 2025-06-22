import {
  CATEGORIES,
  type Category,
  STATUS,
  type Status,
} from "../../src/constants";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import * as UserQuestPlaceholders from "./userQuestPlaceholdersModel";

export type QuestData = Omit<Doc<"quests">, "_id"> & Doc<"userQuests">;
export type PlaceholderData = Doc<"userQuestPlaceholders">;

export type QuestItem = {
  type: "quest";
  category: Category;
  data: QuestData;
  slug: string;
};

export type PlaceholderItem = {
  type: "placeholder";
  category: Category;
  data: PlaceholderData;
};

export type CategoryItem = QuestItem | PlaceholderItem;

export type CategoryGroup = {
  label: string;
  category: Category | null;
  items: CategoryItem[];
};

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

export async function getByCategoryWithPlaceholdersForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
): Promise<CategoryGroup[]> {
  const questsByCategory = await getByCategoryForUser(ctx, {
    userId,
  });

  const placeholders = await UserQuestPlaceholders.getActivePlaceholdersForUser(
    ctx,
    {
      userId,
    },
  );

  // Combine quests and placeholders into a single structure
  const result: Record<string, CategoryItem[]> = {};

  for (const [category, quests] of Object.entries(questsByCategory)) {
    if (!result[category]) {
      result[category] = [];
    }

    for (const quest of quests) {
      result[category].push({
        type: "quest",
        category: category as Category,
        data: quest,
        slug: quest.slug,
      });
    }
  }

  for (const placeholder of placeholders) {
    const category = placeholder.category;
    if (!result[category]) {
      result[category] = [];
    }

    result[category].push({
      type: "placeholder",
      category: category as Category,
      data: placeholder,
    });
  }

  // Create groups array with proper ordering
  const groups: CategoryGroup[] = [];

  // Get all categories that have items, sorted by their order in CATEGORIES
  const categoriesWithItems = Object.keys(result).sort((a, b) => {
    const categoryA = a as Category;
    const categoryB = b as Category;
    const categoryKeys = Object.keys(CATEGORIES) as Category[];
    return categoryKeys.indexOf(categoryA) - categoryKeys.indexOf(categoryB);
  });

  // Add core categories as a single group if any exist
  const coreCategories = categoriesWithItems.filter(
    (category) => CATEGORIES[category as Category]?.isCore,
  );

  if (coreCategories.length > 0) {
    groups.push({
      label: "Core",
      category: null,
      items: coreCategories.flatMap((category) => result[category]),
    });
  }

  // Add non-core categories as individual groups
  const nonCoreCategories = categoriesWithItems.filter(
    (category) => !CATEGORIES[category as Category]?.isCore,
  );

  for (const category of nonCoreCategories) {
    groups.push({
      label: CATEGORIES[category as Category].label,
      category: category as Category,
      items: result[category],
    });
  }

  return groups;
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

  await UserQuestPlaceholders.dismissPlaceholderForUser(ctx, {
    userId,
    category: quest.category as Category,
  });

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
