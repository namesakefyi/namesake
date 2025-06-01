import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type PDFId, PDF_IDS } from "../../src/constants/forms";
import { api } from "../_generated/api";
import { createUser } from "../helpers";
import schema from "../schema";
import { modules } from "../test.setup";

const UPDATE_TIMESTAMP = 662585400000;
const TEST_PDF_IDS: PDFId[] = [...PDF_IDS];

describe("userDocuments", () => {
  beforeEach(() => {
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return an empty list for a new user", async () => {
    const t = convexTest(schema, modules);
    const { asUser } = await createUser(t);

    const docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toEqual([]);
  });

  it("should add documents for a user and list them", async () => {
    const t = convexTest(schema, modules);
    const { asUser, userId } = await createUser(t);

    await asUser.mutation(api.userDocuments.set, {
      pdfIds: [TEST_PDF_IDS[0], TEST_PDF_IDS[1]],
    });
    const docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toHaveLength(2);
    expect(docs.map((d: any) => d.pdfId)).toEqual(
      expect.arrayContaining([TEST_PDF_IDS[0], TEST_PDF_IDS[1]]),
    );
    expect(docs.every((d: any) => d.userId === userId)).toBe(true);
  });

  it("should not duplicate userDocuments for the same pdfId", async () => {
    const t = convexTest(schema, modules);
    const { asUser } = await createUser(t);

    await asUser.mutation(api.userDocuments.set, { pdfIds: [TEST_PDF_IDS[2]] });
    await asUser.mutation(api.userDocuments.set, { pdfIds: [TEST_PDF_IDS[2]] });
    const docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toHaveLength(1);
    expect(docs[0].pdfId).toBe(TEST_PDF_IDS[2]);
  });

  it("should delete all documents for the current user", async () => {
    const t = convexTest(schema, modules);
    const { asUser } = await createUser(t);

    await asUser.mutation(api.userDocuments.set, { pdfIds: TEST_PDF_IDS });
    let docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toHaveLength(TEST_PDF_IDS.length);
    await asUser.mutation(api.userDocuments.deleteAllForCurrentUser, {});
    docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toHaveLength(0);
  });

  it("should delete specific userDocument IDs", async () => {
    const t = convexTest(schema, modules);
    const { asUser } = await createUser(t);

    await asUser.mutation(api.userDocuments.set, { pdfIds: TEST_PDF_IDS });
    let docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toHaveLength(TEST_PDF_IDS.length);
    // Delete the first two
    const idsToDelete = docs.slice(0, 2).map((d: any) => d._id);
    await asUser.mutation(api.userDocuments.deleteByIds, {
      userDocumentIds: idsToDelete,
    });
    docs = await asUser.query(api.userDocuments.list, {});
    expect(docs).toHaveLength(TEST_PDF_IDS.length - 2);
    expect(docs.map((d: any) => d.pdfId)).toEqual(
      expect.arrayContaining([TEST_PDF_IDS[2], TEST_PDF_IDS[3]]),
    );
  });
});
