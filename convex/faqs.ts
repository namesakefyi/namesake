import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllFAQs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqs").collect();
  },
});

export const createFAQ = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    topics: v.array(v.id("topics")),
  },
  handler: async (ctx, { question, answer, topics }) => {
    return await ctx.db.insert("faqs", {
      question,
      answer,
      topics,
    });
  },
});

export const updateFAQ = mutation({
  args: {
    faqId: v.id("faqs"),
    faq: v.object({
      question: v.string(),
      answer: v.string(),
      topics: v.array(v.id("topics")),
      relatedQuests: v.optional(v.array(v.id("quests"))),
    }),
  },
  handler: async (ctx, { faqId, faq }) => {
    return await ctx.db.patch(faqId, {
      ...faq,
    });
  },
});

export const deleteFAQ = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, { faqId }) => {
    const faq = await ctx.db.get(faqId);
    if (faq === null) throw new Error("Question not found");
    if (faq.relatedQuests && faq.relatedQuests.length > 0) {
      throw new Error(
        "There are related quests for this question. Please delete them first.",
      );
    }
    return await ctx.db.delete(faqId);
  },
});
