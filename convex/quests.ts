import { v } from "convex/values";
import { Model } from "survey-core";
import { query } from "./_generated/server";
import { DEFAULT_TIME_REQUIRED } from "./constants";
import { userMutation } from "./helpers";
import { category, jurisdiction, timeRequiredUnit } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

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
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect();
  },
});

export const getById = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.questId);
  },
});

export const create = userMutation({
  args: {
    title: v.string(),
    jurisdiction: v.optional(jurisdiction),
    category: v.optional(category),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quests", {
      title: args.title,
      category: args.category,
      jurisdiction: args.jurisdiction,
      timeRequired: DEFAULT_TIME_REQUIRED,
      creationUser: ctx.userId,
    });
  },
});

export const setAll = userMutation({
  args: {
    // TODO: Dedupe these types from schema
    questId: v.id("quests"),
    title: v.string(),
    jurisdiction: v.optional(jurisdiction),
    category: v.optional(category),
    costs: v.optional(
      v.array(
        v.object({
          cost: v.number(),
          description: v.string(),
        }),
      ),
    ),
    timeRequired: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        unit: timeRequiredUnit,
        description: v.optional(v.string()),
      }),
    ),
    urls: v.optional(v.array(v.string())),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, {
      // TODO: Dedupe
      title: args.title,
      jurisdiction: args.jurisdiction,
      category: args.category,
      costs: args.costs,
      timeRequired: args.timeRequired,
      urls: args.urls,
      content: args.content,
    });
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

export const setContent = userMutation({
  args: {
    questId: v.id("quests"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { content: args.content });
  },
});

export const setFormSchema = userMutation({
  args: {
    questId: v.id("quests"),
    saveNo: v.number(),
    formSchema: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.formSchema) return;
    try {
      const submittedSchema = JSON.parse(args.formSchema);
      const survey = new Model(submittedSchema);
      const validatedSchema = survey.toJSON();

      console.log("Validated schema:", JSON.stringify(validatedSchema));
      await ctx.db.patch(args.questId, {
        formSchema: JSON.stringify(validatedSchema),
      });
    } catch (e) {
      console.error(e);
    }
  },
});

export const softDelete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { deletionTime: Date.now() });
  },
});

export const undoSoftDelete = userMutation({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questId, { deletionTime: undefined });
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
