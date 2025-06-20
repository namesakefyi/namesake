import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import * as UserQuestPlaceholders from "./userQuestPlaceholdersModel";

export async function createUser(
  ctx: MutationCtx,
  user: {
    name: string;
    email: string;
    emailVerified: boolean;
  },
) {
  const id = await ctx.db.insert("users", {
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    role: "user",
  });

  await ctx.db.insert("userSettings", {
    userId: id,
    theme: "system",
    color: "rainbow",
  });

  await UserQuestPlaceholders.createDefaultPlaceholdersForUser(ctx, {
    userId: id,
  });

  return id;
}

export async function updateUser(
  ctx: MutationCtx,
  user: {
    userId: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    twoFactorEnabled?: boolean;
    createdAt: number;
    updatedAt: number;
  },
) {
  await ctx.db.patch(user.userId as Id<"users">, {
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
  });
}

export async function deleteUser(ctx: MutationCtx, id: string) {
  const userId = id as Id<"users">;

  // Delete userQuests
  const userQuests = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();
  for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

  // Delete userQuestPlaceholders
  const userQuestPlaceholders = await ctx.db
    .query("userQuestPlaceholders")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();
  for (const userQuestPlaceholder of userQuestPlaceholders)
    await ctx.db.delete(userQuestPlaceholder._id);

  // Delete userSettings
  const userSettings = await ctx.db
    .query("userSettings")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first();
  if (userSettings) await ctx.db.delete(userSettings._id);

  // Finally, delete the user
  await ctx.db.delete(userId);
}
