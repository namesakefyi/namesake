import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";
import { jurisdiction } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAllForms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("forms").collect();
  },
});

export const getForm = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.formId);
  },
});

export const getAllActiveForms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("forms")
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect();
  },
});

export const getFormPDFUrl = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    if (!form || !form.file) return null;
    return await ctx.storage.getUrl(form.file);
  },
});

export const getFormPDFMetadata = query({
  args: { storageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.db.system.get(args.storageId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const uploadPDF = userMutation({
  args: { formId: v.id("forms"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.formId, {
      file: args.storageId,
    });
  },
});

export const getFormsForQuest = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const forms = await ctx.db
      .query("forms")
      .withIndex("quest", (q) => q.eq("questId", args.questId))
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect();

    return await Promise.all(
      forms.map(async (form) => ({
        ...form,
        url: form.file ? await ctx.storage.getUrl(form.file) : null,
      })),
    );
  },
});

export const createForm = userMutation({
  args: {
    title: v.string(),
    formCode: v.optional(v.string()),
    jurisdiction: jurisdiction,
    file: v.optional(v.id("_storage")),
    questId: v.id("quests"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("forms", {
      title: args.title,
      formCode: args.formCode,
      jurisdiction: args.jurisdiction,
      file: args.file,
      questId: args.questId,
      creationUser: ctx.userId,
    });
  },
});

export const deleteForm = userMutation({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.formId, { deletionTime: Date.now() });
  },
});

export const undeleteForm = userMutation({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.formId, { deletionTime: undefined });
  },
});

export const permanentlyDeleteForm = userMutation({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    // TODO: Delete form references in other tables

    // Delete the form
    await ctx.db.delete(args.formId);
  },
});
