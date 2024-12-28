import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";
import { formField } from "./validators";

export const getById = query({
  args: { fieldId: v.id("formFields") },
  handler: async (ctx, { fieldId }) => {
    return await ctx.db.get(fieldId);
  },
});

export const getByIds = query({
  args: { fieldIds: v.array(v.id("formFields")) },
  handler: async (ctx, { fieldIds }) => {
    return await ctx.db
      .query("formFields")
      .filter((q) => fieldIds.some((id) => q.eq(q.field("_id"), id)))
      .collect();
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("formFields").collect();
  },
});

export const create = userMutation({
  args: {
    type: formField,
    label: v.string(),
    name: v.string(),
    required: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("formFields", {
      type: args.type,
      label: args.label,
      name: args.name,
      required: args.required,
    });
  },
});

export const update = userMutation({
  args: {
    fieldId: v.id("formFields"),
    type: formField,
    label: v.string(),
    name: v.string(),
    required: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.fieldId, {
      type: args.type,
      label: args.label,
      name: args.name,
      required: args.required,
    });
  },
});

export const remove = userMutation({
  args: { fieldId: v.id("formFields") },
  handler: async (ctx, { fieldId }) => {
    return await ctx.db.delete(fieldId);
  },
});
