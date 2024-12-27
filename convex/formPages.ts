import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";
import { formField } from "./validators";

export const getAllByFormId = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, { formId }) => {
    return await ctx.db
      .query("formPages")
      .filter((q) => q.eq(q.field("formId"), formId))
      .collect();
  },
});

export const getAllByQuestId = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, { questId }) => {
    const formId = (await ctx.db.get(questId))?.formId;
    if (!formId) {
      return null;
    }
    return await ctx.db
      .query("formPages")
      .withIndex("formId", (q) => q.eq("formId", formId))
      .collect();
  },
});

export const create = userMutation({
  args: {
    formId: v.id("forms"),
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.optional(
      v.array(
        v.object({
          type: formField,
          label: v.string(),
          name: v.string(),
          required: v.optional(v.boolean()),
        }),
      ),
    ),
    questions: v.optional(v.array(v.id("questions"))),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    const pageId = await ctx.db.insert("formPages", {
      formId: args.formId,
      title: args.title,
      description: args.description,
      fields: args.fields,
      questions: args.questions,
    });

    await ctx.db.patch(args.formId, {
      pages: [...(form.pages || []), pageId],
    });

    return pageId;
  },
});

export const update = userMutation({
  args: {
    pageId: v.id("formPages"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    fields: v.optional(
      v.array(
        v.object({
          type: v.string(),
          label: v.string(),
          name: v.string(),
          required: v.optional(v.boolean()),
        }),
      ),
    ),
    questions: v.optional(v.array(v.id("questions"))),
  },
  handler: async (ctx, args) => {
    const { pageId, ...updateData } = args;

    const page = await ctx.db.get(pageId);
    if (!page) {
      throw new Error("Page not found");
    }
    const formId = page.formId;

    if (formId) {
      await ctx.db.patch(formId, {
        updatedAt: Date.now(),
        updatedBy: ctx.userId,
      });
    }

    return await ctx.db.patch(pageId, {
      ...updateData,
    });
  },
});

export const remove = mutation({
  args: { pageId: v.id("formPages") },
  handler: async (ctx, { pageId }) => {
    const page = await ctx.db.get(pageId);
    if (!page) {
      throw new Error("Page not found");
    }

    const form = await ctx.db.get(page.formId);
    if (form) {
      await ctx.db.patch(page.formId, {
        pages: form.pages.filter((id) => id !== pageId),
      });
    }

    return await ctx.db.delete(pageId);
  },
});
