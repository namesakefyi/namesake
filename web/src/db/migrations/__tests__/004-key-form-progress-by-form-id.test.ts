import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, expect, it } from "vitest";
import { FORM_PROGRESS_STORE } from "../../types";
import { migration } from "../004-key-form-progress-by-form-id";
import { runMockMigration, writeMockRecord } from "../test-utils";

const machineState = { value: "review", context: { editingStepId: null } };

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

it("keys saved progress by the new form id", async () => {
  const setup = await runMockMigration((db) => {
    (db as any).createObjectStore(FORM_PROGRESS_STORE, {
      keyPath: "formSlug",
    });
  }, 3);
  setup.close();
  for (const formSlug of ["court-order-ma", "social-security"]) {
    await writeMockRecord(3, FORM_PROGRESS_STORE, {
      formSlug,
      machineState,
      updatedAt: 1000,
    });
  }

  const db = await runMockMigration(migration, 4);
  expect(await db.getAll(FORM_PROGRESS_STORE)).toEqual([
    { formId: "ma/court-order", machineState, updatedAt: 1000 },
    { formId: "social-security", machineState, updatedAt: 1000 },
  ]);
  db.close();
});
