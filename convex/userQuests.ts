import { v } from "convex/values";
import { query } from "./_generated/server";
import { type Category, STATUS, type Status } from "./constants";
import { userMutation, userQuery } from "./helpers";
import { status } from "./validators";

export const getAll = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
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
  },
});

export const count = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    return userQuests.length;
  },
});

export const getAvailable = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const userQuestIds = userQuests.map((quest) => quest.questId);

    const allActiveQuests = await ctx.db
      .query("quests")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    return allActiveQuests.filter((quest) => !userQuestIds.includes(quest._id));
  },
});

export const countGlobalUsage = query({
  args: { questId: v.id("quests") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const quests = await ctx.db
      .query("userQuests")
      .withIndex("questId", (q) => q.eq("questId", args.questId))
      .collect();

    return quests.length;
  },
});

export const countCompleted = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const completedQuests = userQuests.filter(
      (quest) => quest.completedAt !== undefined,
    );

    return completedQuests.length;
  },
});

export const create = userMutation({
  args: { questId: v.id("quests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if quest already exists for user
    const existing = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .filter((q) => q.eq(q.field("questId"), args.questId))
      .collect();

    if (existing.length > 0) throw new Error("Quest already exists for user");

    await ctx.db.insert("userQuests", {
      userId: ctx.userId,
      questId: args.questId,
      status: "notStarted",
    });
  },
});

export const getByQuestId = userQuery({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userQuest = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .filter((q) => q.eq(q.field("questId"), args.questId))
      .first();

    return userQuest;
  },
});

export const getStatus = userQuery({
  args: { questId: v.id("quests") },
  returns: v.string(),
  handler: async (ctx, args) => {
    const userQuest = await getByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("Quest not found");
    return userQuest.status;
  },
});

export const setStatus = userMutation({
  args: { questId: v.id("quests"), status: status },
  returns: v.null(),
  handler: async (ctx, args) => {
    const quest = await ctx.db.get(args.questId);
    if (quest === null) throw new Error("Quest not found");

    const userQuest = await getByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("User quest not found");

    // Throw if status is invalid
    if (!STATUS[args.status as Status]) throw new Error("Invalid status");

    // Prevent setting the existing status
    if (userQuest.status === args.status) {
      return;
    }

    // Build the update object based on status transitions
    const update: {
      status: Status;
      startedAt?: number | undefined;
      completedAt?: number | undefined;
    } = {
      status: args.status as Status,
    };

    // Handle all status transitions
    switch (args.status) {
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
  },
});

export const deleteForever = userMutation({
  args: { questId: v.id("quests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userQuest = await getByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("Quest not found");
    await ctx.db.delete(userQuest._id);
  },
});

export const getByQuestIds = userQuery({
  args: { questIds: v.array(v.id("quests")) },
  handler: async (ctx, args) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    return userQuests.filter((uq) => args.questIds.includes(uq.questId));
  },
});

export const getQuestCounts = query({
  args: { questIds: v.array(v.id("quests")) },
  returns: v.array(v.object({ questId: v.id("quests"), count: v.number() })),
  handler: async (ctx, args) => {
    const counts = await Promise.all(
      args.questIds.map(async (questId) => {
        const count = await ctx.db
          .query("userQuests")
          .withIndex("questId", (q) => q.eq("questId", questId))
          .collect();
        return { questId, count: count.length };
      }),
    );
    return counts;
  },
});

export const getByCategory = userQuery({
  args: {},
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

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
  },
});
