import { userQuery } from "./helpers";

export const getUserData = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    const userData = await ctx.db
      .query("userEncryptedData")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .first();

    return userData;
  },
});
