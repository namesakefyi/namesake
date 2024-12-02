import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questions").collect();
  },
});

export const create = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    topics: v.array(v.id("topics")),
    relatedQuests: v.optional(v.array(v.id("quests"))),
  },
  handler: async (ctx, { question, answer, topics, relatedQuests }) => {
    return await ctx.db.insert("questions", {
      question,
      answer,
      topics,
      relatedQuests,
    });
  },
});

export const update = mutation({
  args: {
    questionId: v.id("questions"),
    question: v.object({
      question: v.string(),
      answer: v.string(),
      topics: v.array(v.id("topics")),
      relatedQuests: v.optional(v.array(v.id("quests"))),
    }),
  },
  handler: async (ctx, { questionId, question }) => {
    return await ctx.db.patch(questionId, {
      ...question,
    });
  },
});

export const deleteForever = mutation({
  args: { questionId: v.id("questions") },
  handler: async (ctx, { questionId }) => {
    const question = await ctx.db.get(questionId);
    if (question === null) throw new Error("Question not found");
    if (question.relatedQuests && question.relatedQuests.length > 0) {
      throw new Error(
        "There are related quests for this question. Please delete them first.",
      );
    }
    return await ctx.db.delete(questionId);
  },
});
