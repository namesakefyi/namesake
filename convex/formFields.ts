import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";
import { formField } from "./validators";

export const getById = query({
  args: { fieldId: v.optional(v.id("formFields")) },
  handler: async (ctx, { fieldId }) => {
    if (!fieldId) return null;
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
    formPageId: v.id("formPages"),
    type: formField,
    label: v.optional(v.string()),
    name: v.optional(v.string()),
    required: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.formPageId);

    if (!page) {
      throw new Error("Form page not found");
    }

    const existingFields = page.fields ?? [];

    const fieldId = await ctx.db.insert("formFields", {
      type: args.type,
      label: args.label,
      name: args.name,
    });

    await ctx.db.patch(args.formPageId, {
      fields: [...existingFields, fieldId],
    });

    return fieldId;
  },
});

export const update = userMutation({
  args: {
    fieldId: v.id("formFields"),
    type: formField,
    label: v.optional(v.string()),
    name: v.optional(v.string()),
    required: v.optional(v.boolean()),
    options: v.optional(
      v.array(
        v.object({
          label: v.string(),
          value: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.fieldId, {
      type: args.type,
      label: args.label,
      name: args.name,
      options: args.options,
    });
  },
});

export const remove = userMutation({
  args: { fieldId: v.id("formFields") },
  handler: async (ctx, { fieldId }) => {
    // TODO: Remove field from all form pages

    return await ctx.db.delete(fieldId);
  },
});
