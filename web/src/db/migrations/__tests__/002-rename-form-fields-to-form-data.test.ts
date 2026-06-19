import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "../../types";
import { migration } from "../002-rename-form-fields-to-form-data";
import { makeMockDb, runMockMigration, writeMockRecord } from "../test-utils";

const LEGACY_STORE = "formFields";

const withLegacyStore = (db: any) => {
  db.createObjectStore(LEGACY_STORE, { keyPath: "field" });
};

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("002: rename formFields → formData, add formProgress", () => {
  it("renames formFields to formData", async () => {
    const db = await runMockMigration(migration, 2, withLegacyStore);
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(LEGACY_STORE)).toBe(false);
    db.close();
  });

  it("creates the formProgress store", async () => {
    const db = await runMockMigration(migration, 2, withLegacyStore);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    db.close();
  });

  it("preserves all formFields records in formData after rename", async () => {
    // Create v1 DB with formFields schema, then close so the upgrade can proceed
    const setupDb = await runMockMigration((db) => {
      (db as any).createObjectStore(LEGACY_STORE, { keyPath: "field" });
    }, 1);
    setupDb.close();

    await writeMockRecord(1, LEGACY_STORE, {
      field: "firstName",
      value: "Alice",
      createdAt: 1000,
      updatedAt: 1000,
    });

    // v1 already exists with formFields — no setup needed
    const db = await runMockMigration(migration, 2);
    const record = await db.get(FORM_DATA_STORE, "firstName");
    expect(record?.value).toBe("Alice");
    expect(record?.createdAt).toBe(1000);
    db.close();
  });

  it("is idempotent when formFields is gone and formData+formProgress already exist", () => {
    const mockDb = makeMockDb([FORM_DATA_STORE, FORM_PROGRESS_STORE]);
    expect(() => migration(mockDb, null as any)).not.toThrow();
  });
});
