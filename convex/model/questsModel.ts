import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
  type Category,
  DEFAULT_TIME_REQUIRED,
  type Jurisdiction,
} from "../constants";
import * as QuestFaqs from "./questFaqsModel";

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

export async function getByFaqId(
  ctx: QueryCtx,
  { questFaqId }: { questFaqId: Id<"questFaqs"> },
) {
  for await (const quest of ctx.db.query("quests")) {
    if (quest.faqs?.includes(questFaqId)) {
      return quest;
    }
  }
  return null;
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
    timeRequired: DEFAULT_TIME_REQUIRED,
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

export async function updateUrls(
  ctx: MutationCtx,
  {
    questId,
    userId,
    urls,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    urls?: string[];
  },
) {
  return await update(ctx, questId, userId, { urls });
}

export async function addUrl(
  ctx: MutationCtx,
  {
    questId,
    userId,
    url,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    url: string;
  },
) {
  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const existingUrls = quest.urls || [];
  return await update(ctx, questId, userId, {
    urls: [...existingUrls, url],
  });
}

export async function deleteUrl(
  ctx: MutationCtx,
  {
    questId,
    userId,
    url,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    url: string;
  },
) {
  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const existingUrls = quest.urls || [];
  return await update(ctx, questId, userId, {
    urls: existingUrls.filter((u) => u !== url),
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
    costs?: Array<{ cost: number; description: string }>;
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

export async function addStep(
  ctx: MutationCtx,
  {
    questId,
    userId,
    title,
    content,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    title: string;
    content?: string;
  },
) {
  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const newStep = await ctx.db.insert("questSteps", {
    questId,
    title,
    content,
  });

  const existingSteps = quest.steps || [];
  return await update(ctx, questId, userId, {
    steps: [...existingSteps, newStep],
  });
}

export async function deleteStep(
  ctx: MutationCtx,
  {
    questId,
    userId,
    stepId,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    stepId: Id<"questSteps">;
  },
) {
  const step = await ctx.db.get(stepId);
  if (!step) throw new Error("Step not found");

  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const updatedSteps = quest.steps?.filter((id) => id !== stepId);
  await update(ctx, questId, userId, { steps: updatedSteps });
  await ctx.db.delete(stepId);
}

export async function addFaq(
  ctx: MutationCtx,
  {
    questId,
    userId,
    question,
    answer,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    question: string;
    answer: string;
  },
) {
  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const questFaqId = await QuestFaqs.create(ctx, { userId, question, answer });
  const existingFaqs = quest.faqs || [];

  return await update(ctx, questId, userId, {
    faqs: [...existingFaqs, questFaqId],
  });
}

export async function addFaqId(
  ctx: MutationCtx,
  {
    questId,
    userId,
    questFaqId,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    questFaqId: Id<"questFaqs">;
  },
) {
  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const existingFaqs = quest.faqs || [];
  return await update(ctx, questId, userId, {
    faqs: [...existingFaqs, questFaqId],
  });
}

export async function deleteFaq(
  ctx: MutationCtx,
  {
    questId,
    userId,
    questFaqId,
  }: {
    questId: Id<"quests">;
    userId: Id<"users">;
    questFaqId: Id<"questFaqs">;
  },
) {
  const quest = await ctx.db.get(questId);
  if (!quest) throw new Error("Quest not found");

  const updatedFaqs = quest.faqs?.filter((id) => id !== questFaqId);
  return await update(ctx, questId, userId, { faqs: updatedFaqs });
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
