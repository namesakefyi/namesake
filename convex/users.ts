import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { z } from "zod";
import { query } from "./_generated/server";
import type { Role } from "./constants";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "./errors";
import { userMutation, userQuery } from "./helpers";
import { jurisdiction } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getCurrent = userQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.get(ctx.userId);
  },
});

export const getCurrentRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return undefined;
    const user = await ctx.db.get(userId);
    if (!user) return undefined;
    return user.role as Role;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const setName = userMutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { name: args.name });
  },
});

const ParamsSchema = z.object({
  email: z.string().email(),
});

export const setEmail = userMutation({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { error } = ParamsSchema.safeParse(args);
    if (error) {
      throw new ConvexError(INVALID_EMAIL);
    }

    const existingUser = await getByEmail(ctx, {
      email: args.email as string,
    });
    if (existingUser && existingUser._id !== ctx.userId) {
      throw new ConvexError(DUPLICATE_EMAIL);
    }

    await ctx.db.patch(ctx.userId, { email: args.email });
  },
});

export const setResidence = userMutation({
  args: { residence: jurisdiction },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { residence: args.residence });
  },
});

export const setBirthplace = userMutation({
  args: { birthplace: jurisdiction },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { birthplace: args.birthplace });
  },
});

export const setCurrentUserIsMinor = userMutation({
  args: { isMinor: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { isMinor: args.isMinor });
  },
});

// TODO: This throws an error when deleting own account
// Implement RLS check for whether this is the user's own account
// or a different account being deleted by an admin
export const deleteCurrentUser = userMutation({
  args: {},
  handler: async (ctx) => {
    // Delete userQuests
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

    // Delete userSettings
    const userSettings = await ctx.db
      .query("userSettings")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();
    if (userSettings) await ctx.db.delete(userSettings._id);

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
