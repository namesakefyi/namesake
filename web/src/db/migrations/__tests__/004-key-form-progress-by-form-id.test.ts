import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "../../types";
import { migration } from "../004-key-form-progress-by-form-id";
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

function legacyProgress(formSlug: string, value = "review", updatedAt = 1000) {
  return {
    formSlug,
    machineState: { value, context: { formSlug, editingStepId: null } },
    updatedAt,
  };
}

function progress(formId: string, value = "review", updatedAt = 1000) {
  return {
    formId,
    machineState: { value, context: { formId, editingStepId: null } },
    updatedAt,
  };
}

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("4: key form progress by form id", () => {
  it("keys the formProgress store by formId", async () => {
    await seedV3([]);
    const db = await runMockMigration(migration, 4);
    const tx = db.transaction(FORM_PROGRESS_STORE);
    expect(tx.objectStore(FORM_PROGRESS_STORE).keyPath).toBe("formId");
    db.close();
  });

  it("moves saved progress to the new form id", async () => {
    await seedV3([legacyProgress("court-order-ma", "step-3")]);
    const db = await runMockMigration(migration, 4);

    expect(await db.getAll(FORM_PROGRESS_STORE)).toEqual([
      progress("ma/court-order", "step-3"),
    ]);
    db.close();
  });

  it("keeps the id of forms that did not move", async () => {
    await seedV3([legacyProgress("social-security")]);
    const db = await runMockMigration(migration, 4);

    expect(await db.get(FORM_PROGRESS_STORE, "social-security")).toEqual(
      progress("social-security"),
    );
    db.close();
  });

  it("keeps the most recent progress when old and new ids both exist", async () => {
    await seedV3([
      legacyProgress("court-order-ri", "old", 1000),
      legacyProgress("ri/court-order", "new", 2000),
    ]);
    const db = await runMockMigration(migration, 4);

    expect(await db.getAll(FORM_PROGRESS_STORE)).toEqual([
      progress("ri/court-order", "new", 2000),
    ]);
    db.close();
  });

  it("creates the store when it does not exist", async () => {
    const db = await runMockMigration(migration, 4);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    db.close();
  });
});
