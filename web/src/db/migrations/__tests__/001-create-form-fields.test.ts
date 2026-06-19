import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { migration } from "../001-create-form-fields";
import { makeMockDb, runMockMigration } from "../test-utils";

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("001: create formFields store", () => {
  it("creates the formFields object store", async () => {
    const db = await runMockMigration(migration, 1);
    expect(db.objectStoreNames.contains("formFields")).toBe(true);
    db.close();
  });

  it("is idempotent when formFields already exists", () => {
    const mockDb = makeMockDb(["formFields"]);
    expect(() => migration(mockDb, null as any)).not.toThrow();
  });
});
