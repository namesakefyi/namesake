import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, query } from "./_generated/server";
import { userMutation } from "./helpers";
import {
  deleteFaq as deleteQuestFaq,
  getByFaqId as getQuestByFaqId,
} from "./quests";

// Helper function to update parent quest
async function updateParentQuest(
  ctx: MutationCtx,
  questId: Id<"quests">,
  userId: Id<"users">,
) {
  await ctx.db.patch(questId, {
    updatedAt: Date.now(),
    updatedBy: userId,
  });
}

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

export const update = userMutation({
  args: {
    questFaqId: v.id("questFaqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
  },
  handler: async (ctx, { questFaqId, question, answer }) => {
    const questFaq = await ctx.db.get(questFaqId);
    if (!questFaq) throw new Error("Quest FAQ not found");

    const quest = await getQuestByFaqId(ctx, { questFaqId });
    if (quest) {
      await updateParentQuest(ctx, quest._id, ctx.userId);
    }

    return await ctx.db.patch(questFaqId, {
      question,
      answer,
      updatedAt: Date.now(),
    });
  },
});

export const deleteForever = userMutation({
  args: { questFaqId: v.id("questFaqs") },
  handler: async (ctx, { questFaqId }) => {
    const questFaq = await ctx.db.get(questFaqId);
    if (questFaq === null) throw new Error("Question not found");

    const quest = await getQuestByFaqId(ctx, { questFaqId });

    if (quest) {
      await updateParentQuest(ctx, quest._id, ctx.userId);
      await deleteQuestFaq(ctx, { questId: quest._id, questFaqId });
    }

    return await ctx.db.delete(questFaqId);
  },
});
