import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllTopics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("topics").collect();
  },
});

export const createTopic = mutation({
  args: { topic: v.string() },
  handler: async (ctx, { topic }) => {
    return await ctx.db.insert("topics", {
      topic,
    });
  },
});

export const updateTopic = mutation({
  args: { topicId: v.id("topics"), topic: v.string() },
  handler: async (ctx, { topicId, topic }) => {
    return await ctx.db.patch(topicId, {
      topic,
    });
  },
});

export const deleteTopic = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, { topicId }) => {
    // If there are any faqs with this topic, throw an error
    const faqs = await ctx.db
      .query("faqs")
      .withIndex("topics", (q) => q.eq("topics", [topicId]))
      .collect();
    if (faqs.length > 0) {
      throw new Error("Cannot delete topic with faqs");
    }
    return await ctx.db.delete(topicId);
  },
});
