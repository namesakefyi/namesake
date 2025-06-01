import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import type { convexTest } from "convex-test";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return { userId, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return { ctx: { userId }, args: {} };
  },
});

export const adminQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity.subject as Id<"users">))
      .unique();
    if (!user) throw new Error("Not authenticated");
    if (user.role !== "admin") throw new Error("Insufficient permissions");
    return { ctx: { userId: user._id }, args: {} };
  },
});

export const adminMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity.subject as Id<"users">))
      .unique();
    if (!user) throw new Error("Not authenticated");
    if (user.role !== "admin") throw new Error("Insufficient permissions");
    return { ctx: { userId: user._id }, args: {} };
  },
});

export const createUser = async (
  t: ReturnType<typeof convexTest>,
  email?: string,
) => {
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      email: email ?? "user@example.com",
      role: "user",
    });
  });
  const asUser = t.withIdentity({ subject: userId });
  return { userId, asUser };
};

export const createAdmin = async (
  t: ReturnType<typeof convexTest>,
  email?: string,
) => {
  const adminId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      email: email ?? "admin@namesake.fyi",
      role: "admin",
    });
  });
  const asAdmin = t.withIdentity({ subject: adminId });
  return { adminId, asAdmin };
};
