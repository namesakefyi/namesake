import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";

export const getCodesForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("earlyAccessCodes")
      .withIndex("createdBy", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

export const create = userMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.insert("earlyAccessCodes", {
      createdBy: ctx.userId,
    });
  },
});

export const redeem = userMutation({
  args: { earlyAccessCodeId: v.id("earlyAccessCodes") },
  handler: async (ctx, { earlyAccessCodeId }) => {
    const earlyAccessCode = await ctx.db.get(earlyAccessCodeId);

    if (earlyAccessCode === null) throw new Error("This code is invalid.");
    if (earlyAccessCode.claimedBy)
      throw new Error("This code has already been redeemed.");

    return await ctx.db.patch(earlyAccessCodeId, {
      claimedBy: ctx.userId,
    });
  },
});
