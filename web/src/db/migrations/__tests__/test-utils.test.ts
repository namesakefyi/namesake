import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import type { Migration } from "../../types";
import { makeMockDb, runMockMigration, writeMockRecord } from "../test-utils";

// Minimal dummy migration used to exercise the utilities without coupling to
// real migration logic. Casts to any because "things" is not in NamesakeDBSchema.
const createThingsStore: Migration = (db) => {
  if (!(db as any).objectStoreNames.contains("things")) {
    (db as any).createObjectStore("things", { keyPath: "id" });
  }
};

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("runMockMigration", () => {
  it("applies the migration to a blank DB", async () => {
    const db = await runMockMigration(createThingsStore, 1);
    expect((db as any).objectStoreNames.contains("things")).toBe(true);
    db.close();
  });

  it("creates the DB at the requested version", async () => {
    const db = await runMockMigration(createThingsStore, 1);
    expect(db.version).toBe(1);
    db.close();
  });

  it("establishes prior schema via setup before applying the migration", async () => {
    const requiresLegacyStore: Migration = (db) => {
      // Only creates "things" if the prior "legacy" store exists
      if ((db as any).objectStoreNames.contains("legacy")) {
        (db as any).createObjectStore("things", { keyPath: "id" });
      }
    };

    const db = await runMockMigration(requiresLegacyStore, 2, (db) => {
      db.createObjectStore("legacy", { keyPath: "id" });
    });

    expect((db as any).objectStoreNames.contains("legacy")).toBe(true);
    expect((db as any).objectStoreNames.contains("things")).toBe(true);
    db.close();
  });

  it("skips setup when toVersion is 1 (no prior version to establish)", async () => {
    const db = await runMockMigration(createThingsStore, 1, () => {
      throw new Error("setup should not be called for toVersion 1");
    });
    expect((db as any).objectStoreNames.contains("things")).toBe(true);
    db.close();
  });
});

describe("writeMockRecord", () => {
  it("writes a record into the specified store", async () => {
    const db = await runMockMigration(createThingsStore, 1);
    db.close();

    await writeMockRecord(1, "things", { id: "abc", label: "hello" });

    const readDb = await runMockMigration(createThingsStore, 1);
    const record = await (readDb as any).get("things", "abc");
    expect(record).toEqual({ id: "abc", label: "hello" });
    readDb.close();
  });
});

describe("makeMockDb", () => {
  it("contains returns true for stores in the list", () => {
    const db = makeMockDb(["formData", "formProgress"]);
    expect(db.objectStoreNames.contains("formData")).toBe(true);
    expect(db.objectStoreNames.contains("formProgress")).toBe(true);
  });

  it("contains returns false for stores not in the list", () => {
    const db = makeMockDb(["formData"]);
    expect(db.objectStoreNames.contains("formFields")).toBe(false);
  });

  it("createObjectStore throws", () => {
    const db = makeMockDb([]);
    expect(() => db.createObjectStore("anything")).toThrow();
  });

  it("deleteObjectStore throws", () => {
    const db = makeMockDb(["formData"]);
    expect(() => db.deleteObjectStore("formData")).toThrow();
  });
});
