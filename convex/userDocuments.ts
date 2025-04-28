import { v } from "convex/values";
import { userMutation, userQuery } from "./helpers";
import * as UserDocuments from "./model/userDocumentsModel";
import { pdfId } from "./validators";

export const list = userQuery({
  args: {},
  handler: async (ctx, _args) => {
    return await UserDocuments.getAllForUser(ctx, { userId: ctx.userId });
  },
});

export const set = userMutation({
  args: {
    pdfIds: v.array(pdfId),
  },
  handler: async (ctx, args) => {
    return await UserDocuments.addDocumentsForUser(ctx, {
      userId: ctx.userId,
      pdfIds: args.pdfIds,
    });
  },
});

export const deleteAllForCurrentUser = userMutation({
  args: {},
  handler: async (ctx, _args) => {
    return await UserDocuments.deleteAllForUser(ctx, {
      userId: ctx.userId,
    });
  },
});

export const deleteByIds = userMutation({
  args: {
    userDocumentIds: v.array(v.id("userDocuments")),
  },
  handler: async (ctx, args) => {
    return await UserDocuments.deleteByIds(ctx, {
      userDocumentIds: args.userDocumentIds,
    });
  },
});
