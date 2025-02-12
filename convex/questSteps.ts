import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { userMutation } from "./helpers";

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
    // Create the quest step
    const questStepId = await ctx.db.insert("questSteps", {
      questId: args.questId,
      title: args.title,
      content: args.content,
      button: args.button,
    });

    await updateParentQuest(ctx, args.questId, ctx.userId);
    return questStepId;
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
    return questSteps.filter((step) => step !== null);
  },
});

export const update = userMutation({
  args: {
    questStepId: v.id("questSteps"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    button: v.optional(
      v.object({
        text: v.string(),
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const questStep = await ctx.db.get(args.questStepId);
    if (!questStep) throw new Error("Quest step not found");

    const patch: any = {};
    if (args.title !== undefined) patch.title = args.title;
    if (args.content !== undefined) patch.content = args.content;
    if (args.button !== undefined) patch.button = args.button;

    await ctx.db.patch(args.questStepId, patch);
    await updateParentQuest(ctx, questStep.questId, ctx.userId);

    return questStep;
  },
});
