import { v } from "convex/values";
import type { Birthplace, Jurisdiction, Role } from "../src/constants";
import type { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { userMutation, userQuery } from "./helpers";
import * as Users from "./model/usersModel";
import { birthplace, jurisdiction } from "./validators";

export const getAll = query({
  args: {},
  handler: async (ctx) => await Users.getAll(ctx),
});

export const getById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => await Users.getById(ctx, { userId }),
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await betterAuthComponent.getAuthUserId(ctx);
    if (!userId) return null;
    return await Users.getById(ctx, { userId: userId as Id<"users"> });
  },
});

export const getCurrentRole = userQuery({
  args: {},
  handler: async (ctx) => {
    const user = await Users.getById(ctx, { userId: ctx.userId });
    return user?.role as Role;
  },
});

export const getByEmail = query({
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

export const setResidence = userMutation({
  args: { residence: jurisdiction },
  handler: async (ctx, args) => {
    await Users.setResidence(ctx, {
      userId: ctx.userId,
      residence: args.residence as Jurisdiction,
    });
  },
});

export const setBirthplace = userMutation({
  args: { birthplace: birthplace },
  handler: async (ctx, args) => {
    await Users.setBirthplace(ctx, {
      userId: ctx.userId,
      birthplace: args.birthplace as Birthplace,
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

export const deleteCurrentUser = userMutation({
  args: {},
  handler: async (ctx) => {
    await Users.deleteUser(ctx, { userId: ctx.userId });
  },
});
