import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";
import * as EarlyAccessCodes from "./model/earlyAccessCodesModel";

export const getAll = query({
  handler: async (ctx) => {
    return await EarlyAccessCodes.getAll(ctx);
  },
});

export const getCodesForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await EarlyAccessCodes.getCodesForUser(ctx, { userId });
  },
});

export const create = userMutation({
  args: {},
  handler: async (ctx) => {
    return await EarlyAccessCodes.create(ctx, { userId: ctx.userId });
  },
});

export const redeem = mutation({
  args: { earlyAccessCodeId: v.id("earlyAccessCodes") },
  handler: async (ctx, { earlyAccessCodeId }) => {
    return await EarlyAccessCodes.redeem(ctx, { earlyAccessCodeId });
  },
});
