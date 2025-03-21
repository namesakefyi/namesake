import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export function getAll(ctx: QueryCtx) {
  return ctx.db.query("earlyAccessCodes").collect();
}

export function getCodesForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  return ctx.db
    .query("earlyAccessCodes")
    .withIndex("createdBy", (q) => q.eq("createdBy", userId))
    .collect();
}

export function create(ctx: MutationCtx, { userId }: { userId: Id<"users"> }) {
  return ctx.db.insert("earlyAccessCodes", {
    createdBy: userId,
  });
}

export async function redeem(
  ctx: MutationCtx,
  { earlyAccessCodeId }: { earlyAccessCodeId: Id<"earlyAccessCodes"> },
) {
  const earlyAccessCode = await ctx.db.get(earlyAccessCodeId);

  if (earlyAccessCode === null) throw new Error("This code is invalid.");
  if (earlyAccessCode.claimedAt)
    throw new Error("This code has already been redeemed.");

  return await ctx.db.patch(earlyAccessCodeId, {
    claimedAt: Date.now(),
  });
}
