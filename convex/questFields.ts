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
