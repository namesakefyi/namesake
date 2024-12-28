import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqTopics").collect();
  },
});

export const getById = query({
  args: { topicId: v.id("faqTopics") },
  handler: async (ctx, { topicId }) => {
    return await ctx.db.get(topicId);
  },
});

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    return await ctx.db.insert("faqTopics", {
      title,
    });
  },
});

export const set = mutation({
  args: { topicId: v.id("faqTopics"), title: v.string() },
  handler: async (ctx, { topicId, title }) => {
    return await ctx.db.patch(topicId, {
      title,
    });
  },
});

export const deleteForever = mutation({
  args: { topicId: v.id("faqTopics") },
  handler: async (ctx, { topicId }) => {
    // If there are any faqs with this topic, throw an error
    const faqs = await ctx.db
      .query("faqs")
      .withIndex("topics", (q) => q.eq("topics", [topicId]))
      .collect();
    if (faqs.length > 0) {
      throw new Error("Cannot delete topic attached to existing faqs");
    }
    return await ctx.db.delete(topicId);
  },
});
