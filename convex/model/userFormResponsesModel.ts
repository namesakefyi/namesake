import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function getAllForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userData = await ctx.db
    .query("userFormResponses")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  return userData;
}

export async function getByFieldsForUser(
  ctx: QueryCtx,
  { userId, fields }: { userId: Id<"users">; fields: string[] },
) {
  if (!fields) return [];

  const userFormResponses = await Promise.all(
    fields.map(async (field) => {
      const userFormResponse = await ctx.db
        .query("userFormResponses")
        .withIndex("userIdAndField", (q) =>
          q.eq("userId", userId).eq("field", field),
        )
        .first();
      return userFormResponse;
    }),
  );
  return userFormResponses.filter((response) => response !== null);
}

export async function setResponseForUser(
  ctx: MutationCtx,
  { userId, field, value }: { userId: Id<"users">; field: string; value: any },
) {
  // If data already exists, update it
  const existingData = await ctx.db
    .query("userFormResponses")
    .withIndex("userIdAndField", (q) =>
      q.eq("userId", userId).eq("field", field),
    )
    .first();

  if (existingData) {
    await ctx.db.patch(existingData._id, { value });
    return;
  }

  // Otherwise, insert new data
  await ctx.db.insert("userFormResponses", {
    userId,
    field,
    value,
  });
}

export async function deleteByIds(
  ctx: MutationCtx,
  { userFormResponseIds }: { userFormResponseIds: Id<"userFormResponses">[] },
) {
  for (const id of userFormResponseIds) {
    await ctx.db.delete(id);
  }
}

export async function deleteAllForUser(
  ctx: MutationCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userData = await getAllForUser(ctx, { userId });

  for (const data of userData) {
    await ctx.db.delete(data._id);
  }
}
