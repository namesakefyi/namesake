import { v } from "convex/values";
import { query } from "./_generated/server";
import { userMutation } from "./helpers";
import { theme } from "./validators";

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userSettings = await ctx.db
      .query("userSettings")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!userSettings) throw new Error("User settings not found");

    return userSettings;
  },
});

export const setTheme = userMutation({
  args: { theme: theme },
  handler: async (ctx, args) => {
    const userSettings = await ctx.db
      .query("userSettings")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    if (!userSettings) throw new Error("User settings not found");

    await ctx.db.patch(userSettings._id, { theme: args.theme });
  },
});
