import type { Theme } from "../src/constants";
import { userMutation, userQuery } from "./helpers";
import * as UserSettings from "./model/userSettingsModel";
import { theme } from "./validators";

export const getCurrentUserSettings = userQuery({
  args: {},
  handler: async (ctx) => {
    return await UserSettings.getSettingsForUser(ctx, {
      userId: ctx.userId,
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
