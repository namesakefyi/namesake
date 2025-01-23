import { v } from "convex/values";
import { STATUS, type Status } from "./constants";
import { userMutation, userQuery } from "./helpers";
import { coreQuest, status } from "./validators";

export const getAll = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const coreQuests = await ctx.db
      .query("userCoreQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    return coreQuests;
  },
});

export const count = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const coreQuests = await ctx.db
      .query("userCoreQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();
    return coreQuests.length;
  },
});

export const countCompleted = userQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const coreQuests = await ctx.db
      .query("userCoreQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .collect();

    const completedCoreQuests = coreQuests.filter(
      (quest) => quest.completedAt !== undefined,
    );

    return completedCoreQuests.length;
  },
});

export const getByType = userQuery({
  args: { type: coreQuest },
  handler: async (ctx, args) => {
    const coreQuest = await ctx.db
      .query("userCoreQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    return coreQuest;
  },
});

export const setStatus = userMutation({
  args: { type: coreQuest, status: status },
  returns: v.null(),
  handler: async (ctx, args) => {
    const coreQuest = await getByType(ctx, {
      type: args.type,
    });
    if (coreQuest === null) throw new Error("Core quest not found");

    // Throw if status is invalid
    if (!STATUS[args.status as Status]) throw new Error("Invalid status");

    // Prevent setting the existing status
    if (coreQuest.status === args.status) return;

    // If the status is changing to complete, set the completion time
    if (args.status === "complete") {
      await ctx.db.patch(coreQuest._id, {
        status: args.status,
        completedAt: Date.now(),
      });
    }

    // If the status was already complete, unset completion time
    if (coreQuest.status === "complete") {
      await ctx.db.patch(coreQuest._id, {
        status: args.status,
        completedAt: undefined,
      });
    }

    // Otherwise, just update the status
    await ctx.db.patch(coreQuest._id, { status: args.status });
  },
});
