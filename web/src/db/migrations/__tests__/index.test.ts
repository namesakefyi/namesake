import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { openDB } from "idb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DB_NAME,
  DB_VERSION,
  FORM_DATA_STORE,
  FORM_PROGRESS_STORE,
} from "../../init";
import { migrations } from "..";

const LEGACY_STORE = "formFields";

/**
 * Creates the "namesake" DB at v1 using idb, reflecting the real legacy
 * state a returning user would have: a single store named formFields.
 */
async function createLegacyV1DB(): Promise<void> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(LEGACY_STORE)) {
        (db as any).createObjectStore(LEGACY_STORE, { keyPath: "field" });
      }
    },
  });
  db.close();
}

beforeEach(() => {
  global.indexedDB = new IDBFactory();
  vi.resetModules();
});

describe("migration invariant", () => {
  it("migrations array has exactly DB_VERSION entries", () => {
    expect(migrations).toHaveLength(DB_VERSION);
  });
});

describe("upgrade paths", () => {
  it("fresh install (v0 → current): formData and formProgress exist, no formFields", async () => {
    const { getDB } = await import("../../init");
    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    expect((db as any).objectStoreNames.contains(LEGACY_STORE)).toBe(false);
  });

  it("v1 → v2: renames formFields to formData and removes formFields", async () => {
    await createLegacyV1DB();
    const { getDB } = await import("../../init");
    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    expect((db as any).objectStoreNames.contains(LEGACY_STORE)).toBe(false);
  });

  it("v1 → v2 when formProgress already exists: upgrade succeeds", async () => {
    const setupDb = await openDB(DB_NAME, 1, {
      upgrade(db) {
        (db as any).createObjectStore(LEGACY_STORE, { keyPath: "field" });
        (db as any).createObjectStore(FORM_PROGRESS_STORE, {
          keyPath: "formSlug",
        });
      },
    });
    setupDb.close();

    const { getDB } = await import("../../init");
    await expect(getDB()).resolves.toBeDefined();

    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    expect((db as any).objectStoreNames.contains(LEGACY_STORE)).toBe(false);
  });

  it("v2 stuck Safari state → current: formData created, formFields removed", async () => {
    // Simulate the Safari iOS bug: DB was upgraded to v2 but the
    // IDBObjectStore.name setter silently failed, leaving formFields intact.
    const setupDb = await openDB(DB_NAME, 2, {
      upgrade(db) {
        (db as any).createObjectStore(LEGACY_STORE, { keyPath: "field" });
        (db as any).createObjectStore(FORM_PROGRESS_STORE, {
          keyPath: "formSlug",
        });
      },
    });
    setupDb.close();

    const { getDB } = await import("../../init");
    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
    expect((db as any).objectStoreNames.contains(LEGACY_STORE)).toBe(false);
  });
});
