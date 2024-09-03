import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { usState } from "./schema";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAllQuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quests").collect();
  },
});

export const getAllActiveQuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("quests")
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect();
  },
});

export const getQuest = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.questId);
  },
});

export const createQuest = mutation({
  args: { title: v.string(), state: v.optional(usState) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.db.insert("quests", {
      title: args.title,
      state: args.state,
      creationUser: userId,
    });
  },
});

export const addQuestStep = mutation({
  args: { questId: v.id("quests"), title: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existingSteps = (await ctx.db.get(args.questId))?.steps ?? [];

    await ctx.db.patch(args.questId, {
      steps: [
        ...existingSteps,
        {
          title: args.title,
          body: args.body,
        },
      ],
    });
  },
});

export const deleteQuest = mutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await ctx.db.patch(args.questId, { deletionTime: Date.now() });
  },
});

export const undeleteQuest = mutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await ctx.db.patch(args.questId, { deletionTime: undefined });
  },
});

export const permanentlyDeleteQuest = mutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    // Delete userQuests
    const userQuests = await ctx.db
      .query("usersQuests")
      .withIndex("questId", (q) => q.eq("questId", args.questId))
      .collect();
    for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

    // Delete the quest
    await ctx.db.delete(args.questId);
  },
});
