import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("forms").collect();
  },
});

export const getById = query({
  args: { formId: v.optional(v.id("forms")) },
  handler: async (ctx, { formId }) => {
    if (!formId) {
      return null;
    }
    return await ctx.db.get(formId);
  },
});

export const getByQuestId = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, { questId }) => {
    const formId = (await ctx.db.get(questId))?.formId;
    if (!formId) {
      return null;
    }
    return await ctx.db.get(formId);
  },
});

export const create = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const formId = await ctx.db.insert("forms", {
      createdBy: ctx.userId,
      pages: [],
    });

    await ctx.db.patch(args.questId, { formId: formId });
    return formId;
  },
});

export const update = userMutation({
  args: {
    formId: v.id("forms"),
    title: v.optional(v.string()),
    pages: v.optional(v.array(v.id("formPages"))),
  },
  handler: async (ctx, args) => {
    const { formId, ...updateData } = args;
    return await ctx.db.patch(formId, {
      ...updateData,
      updatedBy: ctx.userId,
      updatedAt: Date.now(),
    });
  },
});
