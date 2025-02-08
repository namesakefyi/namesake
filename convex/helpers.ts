import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { type QueryCtx, mutation, query } from "./_generated/server";
import type { Category, Jurisdiction } from "./constants";

export async function getUserByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("externalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await getUserByExternalId(ctx, identity.subject);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return { userId: user._id, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return { ctx: { userId: user._id }, args: {} };
  },
});

export function generateQuestSlug(
  title: string,
  category: Category,
  jurisdiction?: Jurisdiction,
): string {
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Special handling for state-specific documents
  const stateSpecificCategories: Category[] = [
    "courtOrder",
    "birthCertificate",
    "stateId",
  ];

  if (stateSpecificCategories.includes(category) && jurisdiction) {
    // Replace caps with spaces
    const baseSlug = slugify(category.replace(/([A-Z])/g, " $1"));
    return `${baseSlug}-${jurisdiction.toLowerCase()}`;
  }

  // For all other quests, just slugify the title
  return slugify(title);
}
