import { v } from "convex/values";
import { adminQuery, userMutation, userQuery } from "./helpers";
import * as EarlyAccessCodes from "./model/earlyAccessCodesModel";

export const getAll = adminQuery({
  handler: async (ctx) => {
    return await EarlyAccessCodes.getAll(ctx);
  },
});

export const getCodesForUser = userQuery({
  args: {},
  handler: async (ctx) => {
    return await EarlyAccessCodes.getCodesForUser(ctx, { userId: ctx.userId });
  },
});

export const create = userMutation({
  args: {},
  handler: async (ctx) => {
    return await EarlyAccessCodes.create(ctx, { userId: ctx.userId });
  },
});

export const redeem = userMutation({
  args: { earlyAccessCodeId: v.id("earlyAccessCodes") },
  handler: async (ctx, { earlyAccessCodeId }) => {
    return await EarlyAccessCodes.redeem(ctx, { earlyAccessCodeId });
  },
});
