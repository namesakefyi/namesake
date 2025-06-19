import { CATEGORIES, type Category } from "../../src/constants";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function createPlaceholderForUser(
  ctx: MutationCtx,
  { userId, category }: { userId: Id<"users">; category: Category },
) {
  const existingPlaceholder = await ctx.db
    .query("userQuestPlaceholders")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("category"), category))
    .first();

  if (existingPlaceholder) {
    return existingPlaceholder._id;
  }

  return await ctx.db.insert("userQuestPlaceholders", {
    userId,
    category,
  });
}

export async function createDefaultPlaceholdersForUser(
  ctx: MutationCtx,
  { userId }: { userId: Id<"users"> },
) {
  const coreCategories = Object.entries(CATEGORIES)
    .filter(([_, details]) => details.isCore)
    .map(([category]) => category as Category);

  for (const category of coreCategories) {
    await createPlaceholderForUser(ctx, { userId, category });
  }
}

export async function dismissPlaceholderForUser(
  ctx: MutationCtx,
  { userId, category }: { userId: Id<"users">; category: Category },
) {
  const placeholder = await ctx.db
    .query("userQuestPlaceholders")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("category"), category))
    .first();

  if (!placeholder) {
    throw new Error("Placeholder not found for user and category");
  }

  await ctx.db.patch(placeholder._id, {
    dismissedAt: Date.now(),
  });
}

export async function getActivePlaceholdersForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  return await ctx.db
    .query("userQuestPlaceholders")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("dismissedAt"), undefined))
    .collect();
}
