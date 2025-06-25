import { v } from "convex/values";
import type { Status } from "../src/constants";
import { userMutation, userQuery } from "./helpers";
import { status } from "./validators";

export const get = userQuery({
  args: {},
  handler: async (ctx) => {
    const userGettingStarted = await ctx.db
      .query("userGettingStarted")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    return userGettingStarted;
  },
});

export const getStatus = userQuery({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userGettingStarted = await ctx.db
      .query("userGettingStarted")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    return userGettingStarted?.status ?? "notStarted";
  },
});

export const setStatus = userMutation({
  args: { status: status },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userGettingStarted")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    if (!existing) {
      // Create new record
      const update = {
        userId: ctx.userId,
        status: args.status as Status,
        startedAt: undefined as number | undefined,
        completedAt: undefined as number | undefined,
      };

      // Set timestamps based on status
      if (args.status === "inProgress") {
        update.startedAt = Date.now();
      } else if (args.status === "complete") {
        update.startedAt = Date.now();
        update.completedAt = Date.now();
      }

      await ctx.db.insert("userGettingStarted", update);
    } else {
      // Update existing record
      const update: {
        status: Status;
        startedAt?: number | undefined;
        completedAt?: number | undefined;
      } = {
        status: args.status as Status,
      };

      // Handle status transitions
      switch (args.status) {
        case "notStarted":
          update.completedAt = undefined;
          break;
        case "inProgress":
          if (!existing.startedAt) {
            update.startedAt = Date.now();
          }
          if (existing.status === "complete") {
            update.completedAt = undefined;
          }
          break;
        case "complete":
          if (!existing.startedAt) {
            update.startedAt = Date.now();
          }
          update.completedAt = Date.now();
          break;
      }

      await ctx.db.patch(existing._id, update);
    }
  },
});

export const create = userMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("userGettingStarted")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    if (existing) {
      throw new Error("Getting started already exists for user");
    }

    await ctx.db.insert("userGettingStarted", {
      userId: ctx.userId,
      status: "notStarted",
    });
  },
});

export const exists = userQuery({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userGettingStarted = await ctx.db
      .query("userGettingStarted")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    return userGettingStarted !== null;
  },
});
