import type { PDFId } from "../../src/constants";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function getAllForUser(
  ctx: QueryCtx,
  { userId }: { userId: Id<"users"> },
) {
  const userData = await ctx.db
    .query("userDocuments")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  return userData;
}

export async function addDocumentForUser(
  ctx: MutationCtx,
  { userId, pdfId }: { userId: Id<"users">; pdfId: string },
) {
  // If data already exists, update it
  const existingData = await ctx.db
    .query("userDocuments")
    .withIndex("userIdAndPdfId", (q) =>
      q.eq("userId", userId).eq("pdfId", pdfId as PDFId),
    )
    .first();

  if (existingData) {
    await ctx.db.patch(existingData._id, { pdfId: pdfId as PDFId });
    return;
  }

  // Otherwise, insert new data
  await ctx.db.insert("userDocuments", {
    userId,
    pdfId: pdfId as PDFId,
  });
}

export async function addDocumentsForUser(
  ctx: MutationCtx,
  { userId, pdfIds }: { userId: Id<"users">; pdfIds: PDFId[] },
) {
  for (const pdfId of pdfIds) {
    await addDocumentForUser(ctx, { userId, pdfId });
  }
}

export async function deleteByIds(
  ctx: MutationCtx,
  { userDocumentIds }: { userDocumentIds: Id<"userDocuments">[] },
) {
  for (const id of userDocumentIds) {
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
