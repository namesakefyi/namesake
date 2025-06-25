import { v } from "convex/values";
import type { Status } from "../src/constants";
import { query } from "./_generated/server";
import { userMutation, userQuery } from "./helpers";
import * as UserQuests from "./model/userQuestsModel";
import { status } from "./validators";

export const getAll = userQuery({
  args: {},
  handler: async (ctx) => {
    return await UserQuests.getAllForUser(ctx, { userId: ctx.userId });
  },
});

export const count = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    return await UserQuests.getCountForUser(ctx, { userId: ctx.userId });
  },
});

export const getAvailable = userQuery({
  args: {},
  handler: async (ctx) => {
    return await UserQuests.getAvailableForUser(ctx, { userId: ctx.userId });
  },
});

export const countGlobalUsage = query({
  args: { questId: v.id("quests") },
  returns: v.number(),
  handler: async (ctx, args) => {
    return await UserQuests.getGlobalCount(ctx, { questId: args.questId });
  },
});

export const countCompleted = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    return await UserQuests.getCompletedCountForUser(ctx, {
      userId: ctx.userId,
    });
  },
});

export const create = userMutation({
  args: { questId: v.id("quests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await UserQuests.createQuestForUser(ctx, {
      userId: ctx.userId,
      questId: args.questId,
    });
  },
});

export const getByQuestId = userQuery({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    return await UserQuests.getByQuestIdForUser(ctx, {
      userId: ctx.userId,
      questId: args.questId,
    });
  },
});

export const getStatus = userQuery({
  args: { questId: v.id("quests") },
  returns: v.string(),
  handler: async (ctx, args) => {
    return await UserQuests.getQuestStatusForUser(ctx, {
      userId: ctx.userId,
      questId: args.questId,
    });
  },
});

export const setStatus = userMutation({
  args: { questId: v.id("quests"), status: status },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await UserQuests.setQuestStatusForUser(ctx, {
      userId: ctx.userId,
      questId: args.questId,
      status: args.status as Status,
    });
  },
});

export const deleteForever = userMutation({
  args: { questId: v.id("quests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await UserQuests.deleteQuestForUser(ctx, {
      userId: ctx.userId,
      questId: args.questId,
    });
  },
});

export const getByQuestIds = userQuery({
  args: { questIds: v.array(v.id("quests")) },
  handler: async (ctx, args) => {
    return await UserQuests.getByQuestIdsForUser(ctx, {
      userId: ctx.userId,
      questIds: args.questIds,
    });
  },
});

export const getQuestCounts = query({
  args: { questIds: v.array(v.id("quests")) },
  returns: v.array(v.object({ questId: v.id("quests"), count: v.number() })),
  handler: async (ctx, args) => {
    return await UserQuests.getQuestCounts(ctx, {
      questIds: args.questIds,
    });
  },
});

export const getByCategory = userQuery({
  args: {},
  handler: async (ctx) => {
    return await UserQuests.getByCategoryForUser(ctx, {
      userId: ctx.userId,
    });
  },
});

export const getByCategoryWithPlaceholders = userQuery({
  args: {},
  handler: async (ctx) => {
    return await UserQuests.getByCategoryWithPlaceholdersForUser(ctx, {
      userId: ctx.userId,
    });
  },
});

export const getProgress = userQuery({
  args: {},
  returns: v.object({
    totalQuests: v.number(),
    completedQuests: v.number(),
    hasGettingStarted: v.boolean(),
    gettingStartedStatus: v.string(),
  }),
  handler: async (ctx) => {
    const [userQuestsCount, completedQuestsCount, gettingStarted] =
      await Promise.all([
        UserQuests.getCountForUser(ctx, { userId: ctx.userId }),
        UserQuests.getCompletedCountForUser(ctx, { userId: ctx.userId }),
        ctx.db
          .query("userGettingStarted")
          .withIndex("userId", (q) => q.eq("userId", ctx.userId))
          .first(),
      ]);

    const hasGettingStarted = gettingStarted !== null;
    const gettingStartedStatus = gettingStarted?.status ?? "notStarted";
    const isGettingStartedComplete = gettingStartedStatus === "complete";

    return {
      totalQuests: userQuestsCount + (hasGettingStarted ? 1 : 0),
      completedQuests:
        completedQuestsCount + (isGettingStartedComplete ? 1 : 0),
      hasGettingStarted,
      gettingStartedStatus,
    };
  },
});
