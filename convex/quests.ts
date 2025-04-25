import { v } from "convex/values";
import { query } from "./_generated/server";
import {
  type Category,
  DEFAULT_TIME_REQUIRED,
  type Jurisdiction,
} from "./constants";
import { userMutation, userQuery } from "./helpers";
import * as Quests from "./model/questsModel";
import { category, jurisdiction, timeRequiredUnit } from "./validators";

export const count = query({
  args: {},
  handler: async (ctx) => {
    return await Quests.count(ctx);
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await Quests.getAll(ctx);
  },
});

export const getAllInCategory = query({
  args: { category },
  handler: async (ctx, args) => {
    return await Quests.getAllInCategory(ctx, {
      category: args.category as Category,
    });
  },
});

export const getAllActive = query({
  args: {},
  handler: async (ctx) => {
    return await Quests.getAllActive(ctx);
  },
});

export const getWithUserQuest = userQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await Quests.getWithUserQuest(ctx, {
      slug: args.slug,
      userId: ctx.userId,
    });
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
    return await Quests.getByCategoryAndJurisdiction(ctx, {
      category: args.category,
      jurisdiction: args.jurisdiction,
    });
  },
});

export const getById = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.questId);
  },
});

export const getByFaqId = query({
  args: { questFaqId: v.id("questFaqs") },
  handler: async (ctx, args) => {
    return await Quests.getByFaqId(ctx, args);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await Quests.getBySlug(ctx, args);
  },
});

export const create = userMutation({
  args: {
    title: v.string(),
    jurisdiction: v.optional(jurisdiction),
    category: v.optional(category),
  },
  handler: async (ctx, args) => {
    const slug = Quests.generateQuestSlug(
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

    const questId = await ctx.db.insert("quests", {
      title: args.title,
      category: args.category,
      jurisdiction: args.jurisdiction,
      slug: finalSlug,
      timeRequired: DEFAULT_TIME_REQUIRED,
      creationUser: ctx.userId,
      updatedAt: Date.now(),
      updatedBy: ctx.userId,
    });

    return { questId, slug: finalSlug };
  },
});

export const setTitle = userMutation({
  args: { questId: v.id("quests"), title: v.string() },
  handler: async (ctx, args) => {
    await Quests.update(ctx, args.questId, ctx.userId, { title: args.title });
  },
});

export const setJurisdiction = userMutation({
  args: { questId: v.id("quests"), jurisdiction: v.optional(jurisdiction) },
  handler: async (ctx, args) => {
    await Quests.update(ctx, args.questId, ctx.userId, {
      jurisdiction: args.jurisdiction,
    });
  },
});

export const setCategory = userMutation({
  args: { questId: v.id("quests"), category: v.optional(category) },
  handler: async (ctx, args) => {
    await Quests.update(ctx, args.questId, ctx.userId, {
      category: args.category,
    });
  },
});

export const setCosts = userMutation({
  args: {
    questId: v.id("quests"),
    costs: v.optional(
      v.array(v.object({ cost: v.number(), description: v.string() })),
    ),
  },
  handler: async (ctx, args) => {
    return await Quests.setCosts(ctx, {
      questId: args.questId,
      userId: ctx.userId,
      costs: args.costs,
    });
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
    return await Quests.setTimeRequired(ctx, {
      questId: args.questId,
      userId: ctx.userId,
      timeRequired: args.timeRequired,
    });
  },
});

export const addFaq = userMutation({
  args: { questId: v.id("quests"), question: v.string(), answer: v.string() },
  handler: async (ctx, args) => {
    return await Quests.addFaq(ctx, {
      questId: args.questId,
      userId: ctx.userId,
      question: args.question,
      answer: args.answer,
    });
  },
});

export const addFaqId = userMutation({
  args: {
    questId: v.id("quests"),
    questFaqId: v.id("questFaqs"),
  },
  handler: async (ctx, args) => {
    return await Quests.addFaqId(ctx, {
      questId: args.questId,
      userId: ctx.userId,
      questFaqId: args.questFaqId,
    });
  },
});

export const deleteFaq = userMutation({
  args: { questId: v.id("quests"), questFaqId: v.id("questFaqs") },
  handler: async (ctx, args) => {
    return await Quests.deleteFaq(ctx, {
      questId: args.questId,
      userId: ctx.userId,
      questFaqId: args.questFaqId,
    });
  },
});

export const softDelete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await Quests.update(ctx, args.questId, ctx.userId, {
      deletedAt: Date.now(),
    });
  },
});

export const undoSoftDelete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await Quests.update(ctx, args.questId, ctx.userId, {
      deletedAt: undefined,
    });
  },
});

export const deleteForever = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    return await Quests.deleteForever(ctx, { questId: args.questId });
  },
});
