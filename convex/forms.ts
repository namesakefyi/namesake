import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { jurisdictions } from "./schema";

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

export const uploadPDF = mutation({
  args: { formId: v.id("forms"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.formId, {
      file: args.storageId,
    });
  },
});

export const createForm = mutation({
  args: {
    title: v.string(),
    jurisdiction: jurisdictions,
    formCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.db.insert("forms", {
      title: args.title,
      jurisdiction: args.jurisdiction,
      formCode: args.formCode,
      creationUser: userId,
    });
  },
});

export const deleteForm = mutation({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await ctx.db.patch(args.formId, { deletionTime: Date.now() });
  },
});

export const undeleteForm = mutation({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await ctx.db.patch(args.formId, { deletionTime: undefined });
  },
});

export const permanentlyDeleteForm = mutation({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    // TODO: Delete form references in other tables

    // Delete the form
    await ctx.db.delete(args.formId);
  },
});
