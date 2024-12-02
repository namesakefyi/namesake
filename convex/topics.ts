import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("topics").collect();
  },
});

export const getById = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, { topicId }) => {
    return await ctx.db.get(topicId);
  },
});

export const create = mutation({
  args: { topic: v.string() },
  handler: async (ctx, { topic }) => {
    return await ctx.db.insert("topics", {
      topic,
    });
  },
});

export const set = mutation({
  args: { topicId: v.id("topics"), topic: v.string() },
  handler: async (ctx, { topicId, topic }) => {
    return await ctx.db.patch(topicId, {
      topic,
    });
  },
});

export const permanentlyDelete = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, { topicId }) => {
    // If there are any questions with this topic, throw an error
    const questions = await ctx.db
      .query("questions")
      .withIndex("topics", (q) => q.eq("topics", [topicId]))
      .collect();
    if (questions.length > 0) {
      throw new Error("Cannot delete topic with questions");
    }
    return await ctx.db.delete(topicId);
  },
});
