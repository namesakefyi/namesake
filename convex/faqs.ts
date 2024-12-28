import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqs").collect();
  },
});

export const create = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    topics: v.array(v.id("faqTopics")),
    relatedQuests: v.optional(v.array(v.id("quests"))),
  },
  handler: async (ctx, { question, answer, topics, relatedQuests }) => {
    return await ctx.db.insert("faqs", {
      question,
      answer,
      topics,
      relatedQuests,
    });
  },
});

export const update = mutation({
  args: {
    faqId: v.id("faqs"),
    question: v.object({
      question: v.string(),
      answer: v.string(),
      topics: v.array(v.id("faqTopics")),
      relatedQuests: v.optional(v.array(v.id("quests"))),
    }),
  },
  handler: async (ctx, { faqId, question }) => {
    return await ctx.db.patch(faqId, {
      ...question,
    });
  },
});

export const deleteForever = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, { faqId }) => {
    const question = await ctx.db.get(faqId);
    if (question === null) throw new Error("Question not found");
    if (question.relatedQuests && question.relatedQuests.length > 0) {
      throw new Error(
        "There are related quests for this question. Please delete them first.",
      );
    }
    return await ctx.db.delete(faqId);
  },
});
