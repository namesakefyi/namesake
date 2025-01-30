import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";
import {
  deleteFaq as deleteQuestFaq,
  getByFaqId as getQuestByFaqId,
} from "./quests";

export const getByIds = query({
  args: { questFaqIds: v.optional(v.array(v.id("questFaqs"))) },
  handler: async (ctx, { questFaqIds }) => {
    if (!questFaqIds) return [];

    const questFaqs = await Promise.all(
      questFaqIds.map(async (questFaqId) => {
        const questFaq = await ctx.db.get(questFaqId);
        return questFaq;
      }),
    );
    return questFaqs.filter((faq) => faq !== null);
  },
});

export const create = userMutation({
  args: {
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, { question, answer }) => {
    return await ctx.db.insert("questFaqs", {
      question,
      answer,
      author: ctx.userId,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    questFaqId: v.id("questFaqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
  },
  handler: async (ctx, { questFaqId, question, answer }) => {
    const questFaq = await ctx.db.get(questFaqId);
    if (!questFaq) throw new Error("Quest FAQ not found");

    return await ctx.db.patch(questFaqId, {
      question,
      answer,
      updatedAt: Date.now(),
    });
  },
});

export const deleteForever = mutation({
  args: { questFaqId: v.id("questFaqs") },
  handler: async (ctx, { questFaqId }) => {
    const questFaq = await ctx.db.get(questFaqId);
    if (questFaq === null) throw new Error("Question not found");

    const quest = await getQuestByFaqId(ctx, { questFaqId });

    if (quest) {
      await deleteQuestFaq(ctx, { questId: quest._id, questFaqId });
    }

    return await ctx.db.delete(questFaqId);
  },
});
