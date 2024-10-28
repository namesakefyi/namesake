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

export const undeleteField = userMutation({
  args: { fieldId: v.id("questFields") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.fieldId, { deletionTime: undefined });
  },
});
