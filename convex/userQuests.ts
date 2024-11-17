import { v } from "convex/values";
import { query } from "./_generated/server";
import { type Category, STATUS, type Status, type TimeUnit } from "./constants";
import { userMutation, userQuery } from "./helpers";
import { status } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getQuestsForCurrentUser = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const quests = await Promise.all(
      userQuests.map(async (userQuest) => {
        const quest = await ctx.db.get(userQuest.questId);
        return quest && quest.deletionTime === undefined
          ? { ...quest, ...userQuest }
          : null;
      }),
    );

    return quests.filter((quest) => quest !== null);
  },
});

export const getUserQuestCount = userQuery({
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

export const getAvailableQuestsForUser = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const userQuestIds = userQuests.map((quest) => quest.questId);

    const allActiveQuests = await ctx.db
      .query("quests")
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect();

    return allActiveQuests.filter((quest) => !userQuestIds.includes(quest._id));
  },
});

export const getGlobalQuestCount = query({
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

export const getCompletedQuestCount = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const completedQuests = userQuests.filter(
      (quest) => quest.completionTime !== undefined,
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

export const getUserQuestByQuestId = userQuery({
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

export const getUserQuestStatus = userQuery({
  args: { questId: v.id("quests") },
  returns: v.string(),
  handler: async (ctx, args) => {
    const userQuest = await getUserQuestByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("Quest not found");
    return userQuest.status;
  },
});

export const updateQuestStatus = userMutation({
  args: { questId: v.id("quests"), status: status },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("updateQuestStatus", args);
    const quest = await ctx.db.get(args.questId);
    if (quest === null) throw new Error("Quest not found");

    const userQuest = await getUserQuestByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("User quest not found");

    // Prevent setting "ready to file" and "filed" on non-core quests
    if (
      STATUS[args.status as Status].isCoreOnly === true &&
      quest.category !== "core"
    )
      throw new Error("This status is reserved for core quests only.");

    // Prevent setting the existing status
    if (userQuest.status === args.status) return;

    // If the status is changing to complete, set the completion time
    if (args.status === "complete") {
      await ctx.db.patch(userQuest._id, {
        status: args.status,
        completionTime: Date.now(),
      });
    }

    // If the status was already complete, unset completion time
    if (userQuest.status === "complete") {
      await ctx.db.patch(userQuest._id, {
        status: args.status,
        completionTime: undefined,
      });
    }

    // Otherwise, just update the status
    await ctx.db.patch(userQuest._id, { status: args.status });
  },
});

export const removeQuest = userMutation({
  args: { questId: v.id("quests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userQuest = await getUserQuestByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("Quest not found");
    await ctx.db.delete(userQuest._id);
  },
});

export const getUserQuestsByQuestIds = userQuery({
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

export const getUserQuestsByCategory = userQuery({
  args: {},
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const questsWithDetails = await Promise.all(
      userQuests.map(async (userQuest) => {
        const quest = await ctx.db.get(userQuest.questId);
        return quest && quest.deletionTime === undefined
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

export const getUserQuestsByDate = userQuery({
  args: {},
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const questsWithDetails = await Promise.all(
      userQuests.map(async (userQuest) => {
        const quest = await ctx.db.get(userQuest.questId);
        return quest && quest.deletionTime === undefined
          ? { ...quest, ...userQuest }
          : null;
      }),
    );

    const validQuests = questsWithDetails.filter(
      (q): q is NonNullable<typeof q> => q !== null,
    );

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    return validQuests.reduce(
      (acc, quest) => {
        if (quest._creationTime > oneWeekAgo) {
          acc.lastWeek.push(quest);
        } else if (quest._creationTime > oneMonthAgo) {
          acc.lastMonth.push(quest);
        } else {
          acc.earlier.push(quest);
        }
        return acc;
      },
      { lastWeek: [], lastMonth: [], earlier: [] } as Record<
        string,
        typeof validQuests
      >,
    );
  },
});

export const getUserQuestsByStatus = userQuery({
  args: {},
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const questsWithDetails = await Promise.all(
      userQuests.map(async (userQuest) => {
        const quest = await ctx.db.get(userQuest.questId);
        return quest && quest.deletionTime === undefined
          ? { ...quest, ...userQuest }
          : null;
      }),
    );

    const validQuests = questsWithDetails.filter(
      (q): q is NonNullable<typeof q> => q !== null,
    );

    // Initialize an object with all possible status keys
    const initial: Record<Status, typeof validQuests> = {
      notStarted: [],
      inProgress: [],
      readyToFile: [],
      filed: [],
      complete: [],
    };

    // Group quests by their status
    return validQuests.reduce((acc, quest) => {
      acc[quest.status as Status].push(quest);
      return acc;
    }, initial);
  },
});

export const getUserQuestsByTimeRequired = userQuery({
  args: {},
  handler: async (ctx) => {
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const questsWithDetails = await Promise.all(
      userQuests.map(async (userQuest) => {
        const quest = await ctx.db.get(userQuest.questId);
        return quest && quest.deletionTime === undefined
          ? { ...quest, ...userQuest }
          : null;
      }),
    );

    const validQuests = questsWithDetails.filter(
      (q): q is NonNullable<typeof q> => q !== null,
    );

    // Initialize an object with all possible time required keys
    const initial: Record<TimeUnit, typeof validQuests> = {
      minutes: [],
      hours: [],
      days: [],
      weeks: [],
      months: [],
    };

    // Group quests by their time required unit
    const group = validQuests.reduce((acc, quest) => {
      acc[quest.timeRequired.unit as TimeUnit].push(quest);
      return acc;
    }, initial);

    console.log("group", group);
    return group;
  },
});
