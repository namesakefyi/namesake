import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "../../types";
import { migration } from "../003-fix-form-data-for-safari";
import { makeMockDb, runMockMigration, writeMockRecord } from "../test-utils";

const LEGACY_STORE = "formFields";

// Simulates the stuck Safari iOS v2 state: formFields + formProgress, no formData.
const withStuckSafariV2State = (db: any) => {
  db.createObjectStore(LEGACY_STORE, { keyPath: "field" });
  db.createObjectStore(FORM_PROGRESS_STORE, { keyPath: "formSlug" });
};

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("003: fix formData for Safari iOS", () => {
  it("creates formData when stuck in Safari state", async () => {
    const db = await runMockMigration(migration, 3, withStuckSafariV2State);
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    db.close();
  });

  it("removes formFields when stuck in Safari state", async () => {
    const db = await runMockMigration(migration, 3, withStuckSafariV2State);
    expect((db as any).objectStoreNames.contains(LEGACY_STORE)).toBe(false);
    db.close();
  });

  it("preserves formProgress when stuck in Safari state", async () => {
    const db = await runMockMigration(migration, 3, withStuckSafariV2State);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    db.close();
  });

  it("copies formFields records into formData", async () => {
    const setupDb = await runMockMigration((db) => {
      (db as any).createObjectStore(LEGACY_STORE, { keyPath: "field" });
      (db as any).createObjectStore(FORM_PROGRESS_STORE, {
        keyPath: "formSlug",
      });
    }, 2);
    setupDb.close();

    await writeMockRecord(2, LEGACY_STORE, {
      field: "firstName",
      value: "Alice",
      createdAt: 1000,
      updatedAt: 2000,
    });

    const db = await runMockMigration(migration, 3);
    const record = await db.get(FORM_DATA_STORE, "firstName");
    expect(record?.value).toBe("Alice");
    expect(record?.createdAt).toBe(1000);
    expect(record?.updatedAt).toBe(2000);
    db.close();
  });

  it("is idempotent when formData and formProgress already exist", () => {
    const mockDb = makeMockDb([FORM_DATA_STORE, FORM_PROGRESS_STORE]);
    expect(() => migration(mockDb, null as any)).not.toThrow();
  });
});
