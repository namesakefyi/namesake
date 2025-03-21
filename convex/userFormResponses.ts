import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";
import * as UserFormResponses from "./model/userFormResponsesModel";

export const list = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    return await UserFormResponses.getAllForUser(ctx, { userId: ctx.userId });
  },
});

export const set = userMutation({
  args: {
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    return await UserFormResponses.setResponseForUser(ctx, {
      userId: ctx.userId,
      field: args.field,
      value: args.value,
    });
  },
});

export const deleteAllForCurrentUser = userMutation({
  args: {},
  handler: async (ctx, _args) => {
    return await UserFormResponses.deleteAllForUser(ctx, {
      userId: ctx.userId,
    });
  },
});

export const deleteByIds = userMutation({
  args: {
    userFormResponseIds: v.array(v.id("userFormResponses")),
  },
  handler: async (ctx, args) => {
    return await UserFormResponses.deleteByIds(ctx, {
      userFormResponseIds: args.userFormResponseIds,
    });
  },
});
