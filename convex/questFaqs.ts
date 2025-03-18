import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";
import * as QuestFaqs from "./model/questFaqsModel";

export const getByIds = query({
  args: { questFaqIds: v.optional(v.array(v.id("questFaqs"))) },
  handler: async (ctx, { questFaqIds }) => {
    return await QuestFaqs.getByIds(ctx, { questFaqIds: questFaqIds ?? [] });
  },
});

export const create = userMutation({
  args: {
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, { question, answer }) => {
    return await QuestFaqs.create(ctx, {
      userId: ctx.userId,
      question,
      answer,
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
    return await QuestFaqs.update(ctx, {
      questFaqId,
      question: question ?? "",
      answer: answer ?? "",
      userId: ctx.userId,
    });
  },
});

export const deleteForever = userMutation({
  args: { questFaqId: v.id("questFaqs") },
  handler: async (ctx, { questFaqId }) => {
    return await QuestFaqs.deleteForever(ctx, {
      questFaqId,
      userId: ctx.userId,
    });
  },
});
