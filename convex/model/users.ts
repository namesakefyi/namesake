import type { QueryCtx } from "../_generated/server";

export function getByEmail(ctx: QueryCtx, { email }: { email: string }) {
  return ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .first();
}
