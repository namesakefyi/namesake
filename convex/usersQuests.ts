import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getQuestsForCurrentUser = query({
  args: {},
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const userQuests = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    const quests = Promise.all(
      userQuests.map((quest) => ctx.db.get(quest.questId)),
    );

    return (await quests).filter((quest) => quest?.deletionTime === undefined);
  },
});

export const getAvailableQuestsForUser = query({
  args: {},
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const userQuests = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    const userQuestIds = userQuests.map((quest) => quest.questId);

    const allActiveQuests = await ctx.db
      .query("quests")
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect();

    return allActiveQuests.filter((quest) => !userQuestIds.includes(quest._id));
  },
});

export const getQuestCount = query({
  args: {
    questId: v.id("quests"),
  },
  handler: async (ctx, args) => {
    const quests = await ctx.db
      .query("usersQuests")
      .withIndex("questId", (q) => q.eq("questId", args.questId))
      .collect();

    return quests.length;
  },
});

export const create = mutation({
  args: {
    questId: v.id("quests"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    // Check if quest already exists for user
    const existing = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("questId"), args.questId))
      .collect();

    if (existing.length > 0) throw new Error("Quest already exists for user");

    await ctx.db.insert("usersQuests", {
      userId,
      questId: args.questId,
    });
  },
});
