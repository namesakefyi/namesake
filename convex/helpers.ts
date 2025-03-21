import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return { userId, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return { ctx: { userId }, args: {} };
  },
});
