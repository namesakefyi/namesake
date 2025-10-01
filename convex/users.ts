import { v } from "convex/values";
import type { Role } from "../src/constants";
import type { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { authComponent } from "./auth";
import { adminQuery, userMutation } from "./helpers";
import * as Users from "./model/usersModel";

export const getAll = adminQuery({
  args: {},
  handler: async (ctx) => await Users.getAll(ctx),
});

export const getById = adminQuery({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => await Users.getById(ctx, { userId }),
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await authComponent.safeGetAuthUser(ctx))?.userId;
    if (!userId) return null;
    return await Users.getById(ctx, {
      userId: userId as Id<"users">,
    });
  },
});

export const getCurrentRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await authComponent.safeGetAuthUser(ctx))?.userId;
    if (!userId) return null;
    const user = await Users.getById(ctx, {
      userId: userId as Id<"users">,
    });
    return user?.role as Role;
  },
});

export const getByEmail = adminQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await Users.getByEmail(ctx, { email });
  },
});

export const setName = userMutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await Users.setName(ctx, {
      userId: ctx.userId,
      name: args.name as string,
    });
  },
});

export const setEmail = userMutation({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await Users.setEmail(ctx, {
      userId: ctx.userId,
      email: args.email as string,
    });
  },
});

export const setCurrentUserIsMinor = userMutation({
  args: { isMinor: v.boolean() },
  handler: async (ctx, args) => {
    await Users.setIsMinor(ctx, {
      userId: ctx.userId,
      isMinor: args.isMinor,
    });
  },
});
