import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";

export const list = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userData = await ctx.db
      .query("userFormData")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    return userData;
  },
});

export const get = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userData = await ctx.db
      .query("userFormData")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    return userData;
  },
});

export const set = userMutation({
  args: {
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    // If data already exists, update it
    const existingData = await ctx.db
      .query("userFormData")
      .withIndex("userIdAndField", (q) =>
        q.eq("userId", ctx.userId).eq("field", args.field),
      )
      .first();

    if (existingData) {
      await ctx.db.patch(existingData._id, { value: args.value });
      return;
    }

    // Otherwise, insert new data
    await ctx.db.insert("userFormData", {
      userId: ctx.userId,
      field: args.field,
      value: args.value,
    });
  },
});
