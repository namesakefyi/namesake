import { ConvexError } from "convex/values";
import { z } from "zod";
import type { Birthplace, Jurisdiction } from "../../src/constants";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "../../src/constants/errors";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export function getAll(ctx: QueryCtx) {
  return ctx.db.query("users").collect();
}

export function getById(
  ctx: QueryCtx,
  { userId }: { userId?: Id<"users"> | null },
) {
  if (!userId) return undefined;
  return ctx.db.get(userId);
}

export function getByEmail(ctx: QueryCtx, { email }: { email: string }) {
  return ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .first();
}

export function setName(
  ctx: MutationCtx,
  { userId, name }: { userId: Id<"users">; name: string },
) {
  return ctx.db.patch(userId, { name });
}

export async function setEmail(
  ctx: MutationCtx,
  { userId, email }: { userId: Id<"users">; email: string },
) {
  const EmailSchema = z.object({
    email: z.string().email(),
  });

  const { error } = EmailSchema.safeParse({ email });
  if (error) {
    throw new ConvexError(INVALID_EMAIL);
  }

  const existingUser = await getByEmail(ctx, {
    email: email as string,
  });
  if (existingUser && existingUser._id !== userId) {
    throw new ConvexError(DUPLICATE_EMAIL);
  }

  await ctx.db.patch(userId, { email });
}

export function setResidence(
  ctx: MutationCtx,
  { userId, residence }: { userId: Id<"users">; residence: Jurisdiction },
) {
  return ctx.db.patch(userId, { residence });
}

export function setBirthplace(
  ctx: MutationCtx,
  { userId, birthplace }: { userId: Id<"users">; birthplace: Birthplace },
) {
  return ctx.db.patch(userId, { birthplace });
}

export function setIsMinor(
  ctx: MutationCtx,
  { userId, isMinor }: { userId: Id<"users">; isMinor: boolean },
) {
  return ctx.db.patch(userId, { isMinor });
}

export async function deleteUser(
  ctx: MutationCtx,
  { userId }: { userId: Id<"users"> },
) {
  // Delete userQuests
  const userQuests = await ctx.db
    .query("userQuests")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();
  for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

  // Delete userSettings
  const userSettings = await ctx.db
    .query("userSettings")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .first();
  if (userSettings) await ctx.db.delete(userSettings._id);

  // Delete authAccounts
  const authAccounts = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
    .collect();
  for (const account of authAccounts) await ctx.db.delete(account._id);

  // Delete authSessions
  const authSessions = await ctx.db
    .query("authSessions")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();
  for (const session of authSessions) await ctx.db.delete(session._id);

  // Finally, delete the user
  await ctx.db.delete(userId);
}
