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
    const userId = (await authComponent.getAuthUser(ctx))
      ?.userId as Id<"users">;
    return { userId, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))
      ?.userId as Id<"users">;
    return { ctx: { userId }, args: {} };
  },
});

export const adminQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))
      ?.userId as Id<"users">;
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .unique();
    if (!user) throw new Error("Unauthenticated");
    if (user.role !== "admin") throw new Error("Insufficient permissions");
    return { ctx: { userId: user._id }, args: {} };
  },
});

export const adminMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = (await authComponent.getAuthUser(ctx))
      ?.userId as Id<"users">;
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .unique();
    if (!user) throw new Error("Unauthenticated");
    if (user.role !== "admin") throw new Error("Insufficient permissions");
    return { ctx: { userId: user._id }, args: {} };
  },
});
