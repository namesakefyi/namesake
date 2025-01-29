import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";
import { getByFaqIds } from "./questSteps";
import { jurisdiction } from "./validators";
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqs").collect();
  },
});

export const create = userMutation({
  args: {
    question: v.string(),
    answer: v.string(),
    jurisdiction: v.optional(jurisdiction),
  },
  handler: async (ctx, { question, answer, jurisdiction }) => {
    return await ctx.db.insert("faqs", {
      question,
      answer,
      jurisdiction,
      creationUser: ctx.userId,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    faqId: v.id("faqs"),
    question: v.object({
      question: v.string(),
      answer: v.string(),
      jurisdiction: v.optional(jurisdiction),
    }),
  },
  handler: async (ctx, { faqId, question }) => {
    return await ctx.db.patch(faqId, {
      ...question,
      updatedAt: Date.now(),
    });
  },
});

export const deleteForever = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, { faqId }) => {
    const question = await ctx.db.get(faqId);
    if (question === null) throw new Error("Question not found");

    const questSteps = await getByFaqIds(ctx, { faqIds: [faqId] });

    if (questSteps.length > 0) {
      throw new Error(
        "There are related quests for this question. Please delete them first.",
      );
    }
    return await ctx.db.delete(faqId);
  },
});
