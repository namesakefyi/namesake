import { v } from "convex/values";
import { query } from "./_generated/server";
import {
  type Category,
  DEFAULT_TIME_REQUIRED,
  type Jurisdiction,
} from "./constants";
import { generateQuestSlug, userMutation, userQuery } from "./helpers";
import { category, jurisdiction, timeRequiredUnit } from "./validators";

export const count = query({
  args: {},
  handler: async (ctx) => {
    const quests = await ctx.db.query("quests").collect();
    return quests.length;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quests").collect();
  },
});

export const getAllInCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quests")
      .withIndex("category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getAllActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("quests")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

export const getWithUserQuest = userQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const quest = await ctx.db
      .query("quests")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!quest) return { quest: null, userQuest: null };

    const userQuest = await ctx.db
      .query("userQuests")
      .withIndex("userId", (q) => q.eq("userId", ctx.userId))
      .filter((q) => q.eq(q.field("questId"), quest._id))
      .first();

    return { quest, userQuest };
  },
});

export const getByCategoryAndJurisdiction = query({
  args: {
    category: v.union(
      v.literal("courtOrder"),
      v.literal("stateId"),
      v.literal("birthCertificate"),
    ),
    jurisdiction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.jurisdiction) return null;

    return await ctx.db
      .query("quests")
      .withIndex("categoryAndJurisdiction", (q) =>
        q.eq("category", args.category).eq("jurisdiction", args.jurisdiction),
      )
      .first();
  },
});

export const getById = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.questId);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const quest = await ctx.db
      .query("quests")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!quest) return null;
    return quest;
  },
});

export const create = userMutation({
  args: {
    title: v.string(),
    jurisdiction: v.optional(jurisdiction),
    category: v.optional(category),
  },
  handler: async (ctx, args) => {
    const slug = generateQuestSlug(
      args.title,
      args.category as Category,
      args.jurisdiction as Jurisdiction,
    );

    // Ensure slug uniqueness
    const existing = await ctx.db
      .query("quests")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();

    const finalSlug = existing
      ? `${slug}-${Math.random().toString(36).substring(2, 7)}`
      : slug;

    return await ctx.db.insert("quests", {
      title: args.title,
      category: args.category,
      jurisdiction: args.jurisdiction,
      slug: finalSlug,
      timeRequired: DEFAULT_TIME_REQUIRED,
      creationUser: ctx.userId,
    });
  },
});

export const setTitle = userMutation({
  args: { questId: v.id("quests"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { title: args.title });
  },
});

export const setJurisdiction = userMutation({
  args: { questId: v.id("quests"), jurisdiction: v.optional(jurisdiction) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { jurisdiction: args.jurisdiction });
  },
});

export const setCategory = userMutation({
  args: { questId: v.id("quests"), category: v.optional(category) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { category: args.category });
  },
});

export const setUrls = userMutation({
  args: { questId: v.id("quests"), urls: v.optional(v.array(v.string())) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { urls: args.urls });
  },
});

export const setCosts = userMutation({
  args: {
    questId: v.id("quests"),
    costs: v.optional(
      v.array(
        v.object({
          cost: v.number(),
          description: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { costs: args.costs });
  },
});

export const setTimeRequired = userMutation({
  args: {
    questId: v.id("quests"),
    timeRequired: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        unit: timeRequiredUnit,
        description: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, {
      timeRequired: args.timeRequired,
    });
  },
});

export const addStep = userMutation({
  args: {
    questId: v.id("quests"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newStep = await ctx.db.insert("questSteps", {
      questId: args.questId,
      title: args.title,
      content: args.content,
    });

    const quest = await ctx.db.get(args.questId);

    if (!quest) throw new Error("Quest not found");

    const existingSteps = quest.steps || [];

    await ctx.db.patch(args.questId, {
      steps: [...existingSteps, newStep],
    });
  },
});

export const deleteStep = userMutation({
  args: { questId: v.id("quests"), stepId: v.id("questSteps") },
  handler: async (ctx, args) => {
    const step = await ctx.db.get(args.stepId);

    if (!step) throw new Error("Step not found");

    // Remove step from the quest
    const quest = await ctx.db.get(args.questId);

    if (!quest) throw new Error("Quest not found");

    const updatedSteps = quest.steps?.filter(
      (stepId) => stepId !== args.stepId,
    );

    await ctx.db.patch(args.questId, {
      steps: updatedSteps,
    });

    // Delete the step
    await ctx.db.delete(args.stepId);
  },
});

export const softDelete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { deletedAt: Date.now() });
  },
});

export const undoSoftDelete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { deletedAt: undefined });
  },
});

export const deleteForever = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    // Delete userQuests
    const userQuests = await ctx.db
      .query("userQuests")
      .withIndex("questId", (q) => q.eq("questId", args.questId))
      .collect();
    for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

    // Delete the quest
    await ctx.db.delete(args.questId);
  },
});
