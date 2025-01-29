import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";

export const create = userMutation({
  args: {
    questId: v.id("quests"),
    title: v.string(),
    content: v.string(),
    button: v.optional(
      v.object({
        text: v.string(),
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questSteps", {
      questId: args.questId,
      title: args.title,
      content: args.content,
      button: args.button,
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
  args: { questStepIds: v.optional(v.array(v.id("questSteps"))) },
  handler: async (ctx, args) => {
    if (!args.questStepIds) return [];

    const questSteps = await Promise.all(
      args.questStepIds.map(async (questStepId) => {
        const questStep = await ctx.db.get(questStepId);
        return questStep;
      }),
    );
    return questSteps;
  },
});

export const getByFaqIds = query({
  args: { faqIds: v.array(v.id("faqs")) },
  handler: async (ctx, { faqIds }) => {
    return await ctx.db
      .query("questSteps")
      .withIndex("faqs", (q) => q.eq("faqs", faqIds))
      .collect();
  },
});

export const update = userMutation({
  args: {
    questStepId: v.id("questSteps"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    faqs: v.optional(v.array(v.id("faqs"))),
    button: v.optional(
      v.object({
        text: v.string(),
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const patch: any = {};
    if (args.title !== undefined) patch.title = args.title;
    if (args.content !== undefined) patch.content = args.content;
    if (args.faqs !== undefined) patch.faqs = args.faqs;
    if (args.button !== undefined) patch.button = args.button;

    return await ctx.db.patch(args.questStepId, patch);
  },
});
