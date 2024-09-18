import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation, userQuery } from "./helpers";
import { theme } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getCurrentUser = userQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.get(ctx.userId);
  },
});

export const setCurrentUserName = userMutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { name: args.name });
  },
});

export const setCurrentUserIsMinor = userMutation({
  args: { isMinor: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { isMinor: args.isMinor });
  },
});

export const setUserTheme = userMutation({
  args: { theme: theme },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { theme: args.theme });
  },
});

export const deleteCurrentUser = userMutation({
  args: {},
  handler: async (ctx) => {
    // Delete userQuests
    const userQuests = await ctx.db
      .query("usersQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

    // Delete authAccounts
    const authAccounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", ctx.userId))
      .collect();
    for (const account of authAccounts) await ctx.db.delete(account._id);

    // Delete authSessions
    const authSessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    for (const session of authSessions) await ctx.db.delete(session._id);

    // Finally, delete the user
    await ctx.db.delete(ctx.userId);
  },
});
