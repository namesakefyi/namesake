import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";
import { field } from "./validators";

export const getAllFields = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questFields").collect();
  },
});

export const getFields = query({
  args: { fieldIds: v.array(v.id("questFields")) },
  handler: async (ctx, args) => {
    const fields = await Promise.all(
      args.fieldIds.map(async (fieldId) => {
        const field = await ctx.db.get(fieldId);
        if (field) return field;
      }),
    ).then((fields) => fields.filter((field) => field !== undefined));
    return fields;
  },
});

export const createField = userMutation({
  args: {
    type: field,
    label: v.string(),
    slug: v.string(),
    helpText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questFields", {
      type: args.type,
      label: args.label,
      slug: args.slug,
      helpText: args.helpText,
    });
  },
});

export const getFieldUsageCount = query({
  args: { fieldId: v.id("questFields") },
  handler: async (ctx, args) => {
    const quests = await ctx.db
      .query("questSteps")
      .filter((q) => q.field("fields") !== null)
      .collect();

    return quests.filter((quest) => quest.fields?.includes(args.fieldId))
      .length;
  },
});

export const deleteField = userMutation({
  args: { fieldId: v.id("questFields") },
  handler: async (ctx, args) => {
    const usageCount = await getFieldUsageCount(ctx, args);
    if (usageCount > 0) {
      throw new Error("Field is in use and cannot be deleted.");
    }
    await ctx.db.patch(args.fieldId, { deletionTime: Date.now() });
  },
});

export const undeleteField = userMutation({
  args: { fieldId: v.id("questFields") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.fieldId, { deletionTime: undefined });
  },
});

export const permanentlyDeleteField = userMutation({
  args: { fieldId: v.id("questFields") },
  handler: async (ctx, args) => {
    const usageCount = await getFieldUsageCount(ctx, args);
    if (usageCount > 0) {
      throw new Error("Field is in use and cannot be deleted.");
    }
    await ctx.db.delete(args.fieldId);
  },
});
