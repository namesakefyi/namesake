import { ConvexError } from "convex/values";
import { z } from "zod";
import {
  MAX_DISPLAY_NAME_LENGTH,
  MIN_DISPLAY_NAME_LENGTH,
} from "../../src/constants";
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
  if (!name) return;
  name = name.trim();

  if (name.length < MIN_DISPLAY_NAME_LENGTH) {
    throw new ConvexError(
      `Display name must be at least ${MIN_DISPLAY_NAME_LENGTH} characters.`,
    );
  }

  if (name.length > MAX_DISPLAY_NAME_LENGTH) {
    throw new ConvexError(
      `Display name must be less than ${MAX_DISPLAY_NAME_LENGTH} characters.`,
    );
  }

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

export function setIsMinor(
  ctx: MutationCtx,
  { userId, isMinor }: { userId: Id<"users">; isMinor: boolean },
) {
  return ctx.db.patch(userId, { isMinor });
}
