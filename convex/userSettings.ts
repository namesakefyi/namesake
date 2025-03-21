import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Theme } from "./constants";
import { userMutation } from "./helpers";
import * as UserSettings from "./model/userSettingsModel";
import { theme } from "./validators";

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await UserSettings.getSettingsForUser(ctx, {
      userId: args.userId,
    });
  },
});

export const setTheme = userMutation({
  args: { theme: theme },
  handler: async (ctx, args) => {
    return await UserSettings.setThemeForUser(ctx, {
      userId: ctx.userId,
      theme: args.theme as Theme,
    });
  },
});
