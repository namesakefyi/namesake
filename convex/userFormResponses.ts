import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";

export const list = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userData = await ctx.db
      .query("userFormResponses")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    return userData;
  },
});

export const get = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userData = await ctx.db
      .query("userFormResponses")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    return userData;
  },
});

export const getByFieldName = userQuery({
  args: {
    field: v.string(),
  },
  handler: async (ctx, args) => {
    const userData = await ctx.db
      .query("userFormResponses")
      .withIndex("userIdAndField", (q) =>
        q.eq("userId", ctx.userId).eq("field", args.field),
      )
      .first();

    return userData?.value;
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
      .query("userFormResponses")
      .withIndex("userIdAndField", (q) =>
        q.eq("userId", ctx.userId).eq("field", args.field),
      )
      .first();

    if (existingData) {
      await ctx.db.patch(existingData._id, { value: args.value });
      return;
    }

    // Otherwise, insert new data
    await ctx.db.insert("userFormResponses", {
      userId: ctx.userId,
      field: args.field,
      value: args.value,
    });
  },
});

export const deleteAllForCurrentUser = userMutation({
  args: {},
  handler: async (ctx, _args) => {
    const userData = await ctx.db
      .query("userFormResponses")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    for (const data of userData) {
      await ctx.db.delete(data._id);
    }
  },
});

export const deleteByIds = userMutation({
  args: {
    userFormResponseIds: v.array(v.id("userFormResponses")),
  },
  handler: async (ctx, args) => {
    for (const id of args.userFormResponseIds) {
      await ctx.db.delete(id);
    }
  },
});
