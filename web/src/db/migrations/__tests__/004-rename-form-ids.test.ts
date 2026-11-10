import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "../../types";
import { migration } from "../004-rename-form-ids";
import { runMockMigration, writeMockRecord } from "../test-utils";

async function seedV3(records: object[]) {
  const db = await runMockMigration((db) => {
    (db as any).createObjectStore(FORM_DATA_STORE, { keyPath: "field" });
    (db as any).createObjectStore(FORM_PROGRESS_STORE, {
      keyPath: "formSlug",
    });
  }, 3);
  db.close();
  for (const record of records) {
    await writeMockRecord(3, FORM_PROGRESS_STORE, record);
  }
}

function progress(formSlug: string, value = "review") {
  return {
    formSlug,
    machineState: { value, context: { formSlug, editingStepId: null } },
    updatedAt: 1000,
  };
}

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("4: rename form ids", () => {
  it("moves saved progress to the new form id", async () => {
    await seedV3([progress("court-order-ma", "step-3")]);
    const db = await runMockMigration(migration, 4);

    expect(await db.get(FORM_PROGRESS_STORE, "court-order-ma")).toBeUndefined();
    expect(await db.get(FORM_PROGRESS_STORE, "ma/court-order")).toEqual({
      formSlug: "ma/court-order",
      machineState: {
        value: "step-3",
        context: { formSlug: "ma/court-order", editingStepId: null },
      },
      updatedAt: 1000,
    });
    db.close();
  });

  it("leaves forms whose id did not change", async () => {
    await seedV3([progress("social-security")]);
    const db = await runMockMigration(migration, 4);

    expect(await db.get(FORM_PROGRESS_STORE, "social-security")).toEqual(
      progress("social-security"),
    );
    db.close();
  });

  it("keeps existing progress under the new id", async () => {
    await seedV3([
      progress("court-order-ri", "old"),
      progress("ri/court-order", "new"),
    ]);
    const db = await runMockMigration(migration, 4);

    expect(await db.get(FORM_PROGRESS_STORE, "court-order-ri")).toBeUndefined();
    expect(await db.get(FORM_PROGRESS_STORE, "ri/court-order")).toEqual(
      progress("ri/court-order", "new"),
    );
    db.close();
  });

  it("does nothing without a formProgress store", async () => {
    const db = await runMockMigration(migration, 4);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(false);
    db.close();
  });
});
