import { v } from "convex/values";
import type { CoreCategory } from "../src/constants";
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
      category: args.category as CoreCategory,
    });
  },
});

export const dismiss = userMutation({
  args: { category: category },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await UserQuestPlaceholders.dismissPlaceholderForUser(ctx, {
      userId: ctx.userId,
      category: args.category as CoreCategory,
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
