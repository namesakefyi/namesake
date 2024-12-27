import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userMutation } from "./helpers";
import { jurisdiction } from "./validators";

// TODO: Add `returns` value validation
// https://docs.convex.dev/functions/validation

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const getAllActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

export const getURL = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document || !document.file) return null;
    return await ctx.storage.getUrl(document.file);
  },
});

export const getMetadata = query({
  args: { storageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.db.system.get(args.storageId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const upload = userMutation({
  args: { documentId: v.id("documents"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.documentId, {
      file: args.storageId,
    });
  },
});

export const getByQuestId = query({
  args: { questId: v.id("quests") },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("quest", (q) => q.eq("questId", args.questId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    return await Promise.all(
      documents.map(async (document) => ({
        ...document,
        url: document.file ? await ctx.storage.getUrl(document.file) : null,
      })),
    );
  },
});

export const create = userMutation({
  args: {
    title: v.string(),
    code: v.optional(v.string()),
    jurisdiction: jurisdiction,
    file: v.optional(v.id("_storage")),
    questId: v.id("quests"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      title: args.title,
      code: args.code,
      jurisdiction: args.jurisdiction,
      file: args.file,
      questId: args.questId,
      creationUser: ctx.userId,
    });
  },
});

export const softDelete = userMutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, { deletedAt: Date.now() });
  },
});

export const undoSoftDelete = userMutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, { deletedAt: undefined });
  },
});

export const deleteForever = userMutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    // TODO: Delete document references in other tables

    // Delete the document
    await ctx.db.delete(args.documentId);
  },
});
