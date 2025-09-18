import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))?.userId;
    return { userId: userId as Id<"users">, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))?.userId;
    return { ctx: { userId: userId as Id<"users"> }, args: {} };
  },
});

export const adminQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))?.userId;
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId as Id<"users">))
      .unique();
    if (!user) throw new Error("Not authenticated");
    if (user.role !== "admin") throw new Error("Insufficient permissions");
    return { ctx: { userId: user._id }, args: {} };
  },
});

export const adminMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))?.userId;
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId as Id<"users">))
      .unique();
    if (!user) throw new Error("Not authenticated");
    if (user.role !== "admin") throw new Error("Insufficient permissions");
    return { ctx: { userId: user._id }, args: {} };
  },
});
