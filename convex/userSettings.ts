import { userMutation } from "./helpers";
import { groupQuestsBy, theme } from "./validators";

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

export const setGroupQuestsBy = userMutation({
  args: { groupQuestsBy: groupQuestsBy },
  handler: async (ctx, args) => {
    const userSettings = await ctx.db
      .query("userSettings")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    if (!userSettings) throw new Error("User settings not found");

    await ctx.db.patch(userSettings._id, { groupQuestsBy: args.groupQuestsBy });
  },
});
