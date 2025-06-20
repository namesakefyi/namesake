import type { Category, Jurisdiction } from "../../src/constants";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

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

export async function count(ctx: QueryCtx) {
  const quests = await ctx.db.query("quests").collect();
  return quests.length;
}

export async function getAll(ctx: QueryCtx) {
  return await ctx.db.query("quests").collect();
}

export async function getAllInCategory(
  ctx: QueryCtx,
  { category }: { category: Category },
) {
  return await ctx.db
    .query("quests")
    .withIndex("category", (q) => q.eq("category", category))
    .collect();
}

export async function getAllActive(ctx: QueryCtx) {
  return await ctx.db
    .query("quests")
    .filter((q) => q.eq(q.field("deletedAt"), undefined))
    .collect();
}

/**
 * Get all active quests, but do not show court orders, state IDs,
 * or birth certificates if the user already has one. This prevents
 * irrelevant quests (court orders in 49+ other states, etc.) from
 * appearing.
 *
 * @param ctx - The query context.
 * @param userId - The ID of the user.
 * @returns The relevant active quests.
 */
export async function getRelevantActiveForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const allActiveQuests = await ctx.db
    .query("quests")
    .filter((q) => q.eq(q.field("deletedAt"), undefined))
    .collect();

  const userQuests = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  const userQuestDetails = await Promise.all(
    userQuests.map(async (userQuest) => {
      const quest = await ctx.db.get(userQuest.questId);
      return quest && quest.deletedAt === undefined ? quest : null;
    }),
  );

  const validUserQuests = userQuestDetails.filter(
    (q): q is NonNullable<typeof q> => q !== null,
  );

  const filterableCategories: Category[] = [
    "courtOrder",
    "birthCertificate",
    "stateId",
  ];

  const userQuestIds = new Set(validUserQuests.map((quest) => quest._id));

  // Group user's quests by category to check which filterable categories they have
  const userQuestsByCategory = validUserQuests.reduce(
    (acc, quest) => {
      const category = quest.category as Category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(quest);
      return acc;
    },
    {} as Record<Category, typeof validUserQuests>,
  );

  const relevantQuests = allActiveQuests.filter((quest) => {
    const category = quest.category as Category;

    // If it's not a filterable category, always include it
    if (!filterableCategories.includes(category)) return true;

    // If it's a filterable category, check if user has any quests in this category
    const userQuestsInCategory = userQuestsByCategory[category] || [];

    // If user has no quests in this category, show all quests in this category
    if (userQuestsInCategory.length === 0) return true;

    // If user has quests in this category, only show the ones they already have
    return userQuestIds.has(quest._id);
  });

  return relevantQuests;
}

export async function getWithUserQuest(
  ctx: QueryCtx,
  { slug, userId }: { slug: string; userId: Id<"users"> },
) {
  const quest = await ctx.db
    .query("quests")
    .withIndex("slug", (q) => q.eq("slug", slug))
    .first();

  if (!quest) return { quest: null, userQuest: null };

  const userQuest = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("questId"), quest._id))
    .first();

  return { quest, userQuest };
}

export async function getByCategoryAndJurisdiction(
  ctx: QueryCtx,
  {
    category,
    jurisdiction,
  }: {
    category: Category;
    jurisdiction?: string;
  },
) {
  if (!jurisdiction) return null;

  return await ctx.db
    .query("quests")
    .withIndex("categoryAndJurisdiction", (q) =>
      q.eq("category", category).eq("jurisdiction", jurisdiction),
    )
    .first();
}

export async function getBySlug(ctx: QueryCtx, { slug }: { slug: string }) {
  return await ctx.db
    .query("quests")
    .withIndex("slug", (q) => q.eq("slug", slug))
    .first();
}

export async function create(
  ctx: MutationCtx,
  {
    title,
    category,
    jurisdiction,
    userId,
  }: {
    title: string;
    category?: Category;
    jurisdiction?: Jurisdiction;
    userId: Id<"users">;
  },
) {
  const slug = generateQuestSlug(title, category as Category, jurisdiction);

  // Ensure slug uniqueness
  const existing = await ctx.db
    .query("quests")
    .withIndex("slug", (q) => q.eq("slug", slug))
    .first();

  const finalSlug = existing
    ? `${slug}-${Math.random().toString(36).substring(2, 7)}`
    : slug;

  const questId = await ctx.db.insert("quests", {
    title,
    category,
    jurisdiction,
    slug: finalSlug,
    creationUser: userId,
    updatedAt: Date.now(),
    updatedBy: userId,
  });

  return { questId, slug: finalSlug };
}

export async function update(
  ctx: MutationCtx,
  questId: Id<"quests">,
  userId: Id<"users">,
  update: Partial<Doc<"quests">>,
) {
  return ctx.db.patch(questId, {
    ...update,
    updatedAt: Date.now(),
    updatedBy: userId,
  });
}

export async function setCosts(
  ctx: MutationCtx,
  {
    questId,
    userId,
    costs,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    costs?: Array<{ cost: number; description: string; isRequired?: boolean }>;
  },
) {
  return await update(ctx, questId, userId, { costs });
}

export async function setTimeRequired(
  ctx: MutationCtx,
  {
    questId,
    userId,
    timeRequired,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    timeRequired?: {
      min: number;
      max: number;
      unit: string;
      description?: string;
    };
  },
) {
  return await update(ctx, questId, userId, { timeRequired });
}

export async function deleteForever(
  ctx: MutationCtx,
  { questId }: { questId: Id<"quests"> },
) {
  // Delete userQuests
  const userQuests = await ctx.db
    .query("userQuests")
    .withIndex("questId", (q) => q.eq("questId", questId))
    .collect();

  for (const userQuest of userQuests) {
    await ctx.db.delete(userQuest._id);
  }

  // Delete the quest
  await ctx.db.delete(questId);
}
