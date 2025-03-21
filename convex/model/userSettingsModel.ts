import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Theme } from "../constants";

export async function getSettingsForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userSettings = await ctx.db
    .query("userSettings")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first();

  if (!userSettings) throw new Error("User settings not found");

  return userSettings;
}

export async function setThemeForUser(
  ctx: MutationCtx,
  { userId, theme }: { userId: Id<"users">; theme: Theme },
) {
  const userSettings = await getSettingsForUser(ctx, { userId });

  if (!userSettings) throw new Error("User settings not found");

  await ctx.db.patch(userSettings._id, { theme });
}
