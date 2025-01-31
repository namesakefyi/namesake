import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("earlyAccessCodes").collect();
  },
});

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

export const redeem = mutation({
  args: { earlyAccessCodeId: v.id("earlyAccessCodes") },
  handler: async (ctx, { earlyAccessCodeId }) => {
    const earlyAccessCode = await ctx.db.get(earlyAccessCodeId);

    if (earlyAccessCode === null) throw new Error("This code is invalid.");
    if (earlyAccessCode.claimedAt)
      throw new Error("This code has already been redeemed.");

    return await ctx.db.patch(earlyAccessCodeId, {
      claimedAt: Date.now(),
    });
  },
});
