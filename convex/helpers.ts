import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import type { Category, Jurisdiction } from "./constants";

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return { userId, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return { ctx: { userId }, args: {} };
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
