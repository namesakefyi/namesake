import { v } from "convex/values";
import { query } from "./_generated/server";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAllFieldsForForm = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("formFields")
      .withIndex("formId", (q) => q.eq("formId", args.formId))
      .collect();
  },
});
