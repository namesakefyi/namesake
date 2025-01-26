import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";

export const create = userMutation({
  args: {
    questId: v.id("quests"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questSteps", {
      questId: args.questId,
      title: args.title,
      content: args.content,
    });
  },
});

export const getById = query({
  args: { questStepId: v.id("questSteps") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.questStepId);
  },
});

export const getByIds = query({
  args: { questStepIds: v.array(v.id("questSteps")) },
  handler: async (ctx, args) => {
    const questSteps = await Promise.all(
      args.questStepIds.map(async (questStepId) => {
        const questStep = await ctx.db.get(questStepId);
        return questStep;
      }),
    );
    return questSteps;
  },
});

export const update = userMutation({
  args: {
    questStepId: v.id("questSteps"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.questStepId, {
      title: args.title,
      content: args.content,
    });
  },
});
