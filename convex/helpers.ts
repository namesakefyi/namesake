import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { betterAuthComponent, createAuth } from "./auth";

export const userQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);
    const session = await auth.api.getSession({
      headers,
    });
    if (!session) {
      throw new Error("Not authenticated");
    }

    const userId = session.user.id as Id<"users">;
    return { userId, ctx };
  }),
);

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);
    const session = await auth.api.getSession({
      headers,
    });
    if (!session) {
      throw new Error("Not authenticated");
    }
    const userId = session.user.id as Id<"users">;
    return { ctx: { userId }, args: {} };
  },
});
