import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";
import { category, jurisdiction } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAllQuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quests").collect();
  },
});

export const getAllQuestsInCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quests")
      .withIndex("category", (q) => q.eq("category", args.category))
      .collect();
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

export const createQuest = userMutation({
  args: {
    title: v.string(),
    jurisdiction: v.optional(jurisdiction),
    category: v.optional(category),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quests", {
      title: args.title,
      category: args.category,
      jurisdiction: args.jurisdiction,
      creationUser: ctx.userId,
    });
  },
});

export const updateQuest = userMutation({
  args: {
    // TODO: Dedupe these types from schema
    questId: v.id("quests"),
    title: v.string(),
    jurisdiction: v.optional(jurisdiction),
    category: v.optional(category),
    costs: v.optional(
      v.array(
        v.object({
          cost: v.number(),
          description: v.string(),
        }),
      ),
    ),
    urls: v.optional(v.array(v.string())),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, {
      // TODO: Dedupe
      title: args.title,
      jurisdiction: args.jurisdiction,
      category: args.category,
      costs: args.costs,
      urls: args.urls,
      content: args.content,
    });
  },
});

export const deleteQuest = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { deletionTime: Date.now() });
  },
});

export const undeleteQuest = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { deletionTime: undefined });
  },
});

export const permanentlyDeleteQuest = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    // Delete userQuests
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("questId", (q) => q.eq("questId", args.questId))
      .collect();
    for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

    // Delete the quest
    await ctx.db.delete(args.questId);
  },
});
