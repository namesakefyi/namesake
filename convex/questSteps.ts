import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const create = userMutation({
  args: {
    questId: v.id("quests"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const questStepId = await ctx.db.insert("questSteps", {
      questId: args.questId,
      title: args.title,
      description: args.description,
      creationUser: ctx.userId,
    });

    const quest = await ctx.db.get(args.questId);

    if (!quest) throw new Error("Quest not found");

    await ctx.db.patch(args.questId, {
      steps: [...(quest.steps ?? []), questStepId],
    });
  },
});

export const getStepsForQuest = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const quest = await ctx.db.get(args.questId);
    if (!quest) throw new Error("Quest not found");
    if (!quest.steps) return [];

    const steps = await Promise.all(
      quest.steps.map(async (stepId) => {
        return await ctx.db.get(stepId);
      }),
    );
    return steps;
  },
});
