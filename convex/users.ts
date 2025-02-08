import type { UserJSON } from "@clerk/backend";
import { type Validator, v } from "convex/values";
import { ConvexError } from "convex/values";
import { z } from "zod";
import { internalMutation, query } from "./_generated/server";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "./errors";
import { getCurrentUser, getUserByExternalId, userMutation } from "./helpers";
import { birthplace, jurisdiction } from "./validators";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => {
    if (!userId) return undefined;
    return await ctx.db.get(userId);
  },
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const upsertFromClerk = internalMutation({
  // No runtime validation, trust Clerk
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      email: data.email_addresses[0].email_address,
      externalId: data.id,
    };

    const user = await getUserByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", {
        ...userAttributes,
        role: "user",
      });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await getUserByExternalId(ctx, clerkUserId);

    if (user !== null) {
      // Delete userQuests
      const userQuests = await ctx.db
        .query("userQuests")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();
      for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

      // Delete userSettings
      const userSettings = await ctx.db
        .query("userSettings")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .first();
      if (userSettings) await ctx.db.delete(userSettings._id);

      // Finally, delete the user
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export const setName = userMutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { name: args.name });
  },
});

const ParamsSchema = z.object({
  email: z.string().email(),
});

export const setEmail = userMutation({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { error } = ParamsSchema.safeParse(args);
    if (error) {
      throw new ConvexError(INVALID_EMAIL);
    }

    const existingUser = await getByEmail(ctx, {
      email: args.email as string,
    });
    if (existingUser && existingUser._id !== ctx.userId) {
      throw new ConvexError(DUPLICATE_EMAIL);
    }

    await ctx.db.patch(ctx.userId, { email: args.email });
  },
});

export const setResidence = userMutation({
  args: { residence: jurisdiction },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { residence: args.residence });
  },
});

export const setBirthplace = userMutation({
  args: { birthplace: birthplace },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { birthplace: args.birthplace });
  },
});

export const setCurrentUserIsMinor = userMutation({
  args: { isMinor: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(ctx.userId, { isMinor: args.isMinor });
  },
});
