import { v } from "convex/values";
import type { Category } from "../src/constants";
import { userMutation, userQuery } from "./helpers";
import * as UserQuestPlaceholders from "./model/userQuestPlaceholdersModel";
import { category } from "./validators";

export const createDefault = userMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    return await UserQuestPlaceholders.createDefaultPlaceholdersForUser(ctx, {
      userId: ctx.userId,
    });
  },
});

export const create = userMutation({
  args: { category: category },
  returns: v.id("userQuestPlaceholders"),
  handler: async (ctx, args) => {
    return await UserQuestPlaceholders.createPlaceholderForUser(ctx, {
      userId: ctx.userId,
      category: args.category as Category,
    });
  },
});

export const dismiss = userMutation({
  args: { category: category },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await UserQuestPlaceholders.dismissPlaceholderForUser(ctx, {
      userId: ctx.userId,
      category: args.category as Category,
    });
  },
});

export const restore = userMutation({
  args: { category: category },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await UserQuestPlaceholders.restorePlaceholderForUser(ctx, {
      userId: ctx.userId,
      category: args.category as Category,
    });
  },
});

export const getActive = userQuery({
  args: {},
  handler: async (ctx) => {
    return await UserQuestPlaceholders.getActivePlaceholdersForUser(ctx, {
      userId: ctx.userId,
    });
  },
});
