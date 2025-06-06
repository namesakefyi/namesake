import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return { userId: identity.subject as Id<"users">, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return { ctx: { userId: identity.subject as Id<"users"> }, args: {} };
  },
});
