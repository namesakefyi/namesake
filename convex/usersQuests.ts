import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation, userQuery } from "./helpers";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getQuestsForCurrentUser = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userQuests = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const quests = Promise.all(
      userQuests.map((quest) => ctx.db.get(quest.questId)),
    );

    return (await quests).filter((quest) => quest?.deletionTime === undefined);
  },
});

export const getAvailableQuestsForUser = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userQuests = await ctx.db
      .query("usersQuests")
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

export const getQuestCount = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const quests = await ctx.db
      .query("usersQuests")
      .withIndex("questId", (q) => q.eq("questId", args.questId))
      .collect();

    return quests.length;
  },
});

export const create = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    // Check if quest already exists for user
    const existing = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .filter((q) => q.eq(q.field("questId"), args.questId))
      .collect();

    if (existing.length > 0) throw new Error("Quest already exists for user");

    await ctx.db.insert("usersQuests", {
      userId: ctx.userId,
      questId: args.questId,
    });
  },
});

export const getUserQuestByQuestId = userQuery({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userQuest = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .filter((q) => q.eq(q.field("questId"), args.questId))
      .first();

    return userQuest;
  },
});

export const markComplete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userQuest = await getUserQuestByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("Quest not found");
    await ctx.db.patch(userQuest._id, { completionTime: Date.now() });
  },
});

export const markIncomplete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userQuest = await getUserQuestByQuestId(ctx, {
      questId: args.questId,
    });
    if (userQuest === null) throw new Error("Quest not found");
    await ctx.db.patch(userQuest._id, { completionTime: undefined });
  },
});
