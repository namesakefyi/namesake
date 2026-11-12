import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, expect, it } from "vitest";
import { FORM_DATA_STORE } from "../../types";
import { migration } from "../005-rename-form-fields";
import { runMockMigration, writeMockRecord } from "../test-utils";

beforeEach(async () => {
  global.indexedDB = new IDBFactory();
  const setup = await runMockMigration((db) => {
    (db as any).createObjectStore(FORM_DATA_STORE, { keyPath: "field" });
  }, 4);
  setup.close();
});

const save = (field: string, value: unknown, updatedAt = 1000) =>
  writeMockRecord(4, FORM_DATA_STORE, {
    field,
    value,
    createdAt: 1000,
    updatedAt,
  });

it("moves saved answers to their new field names", async () => {
  await save("paysChildSupport", true);
  await save("guardianOneFullName", "Alex Smith");
  await save("coGuardianFullName", "Jo Lee");
  await save("oldFirstName", "Sam");

  const db = await runMockMigration(migration, 5);
  const records = await db.getAll(FORM_DATA_STORE);
  expect(
    Object.fromEntries(records.map(({ field, value }) => [field, value])),
  ).toEqual({
    doesPayChildSupport: true,
    guardianFirstName: "Alex Smith",
    coGuardianFirstName: "Jo Lee",
    oldFirstName: "Sam",
  });
  db.close();
});

it("keeps the more recent answer when both names are saved", async () => {
  await save("mothersMaidenName", "Older", 1000);
  await save("mothersLastName", "Newer", 2000);
  await save("parent1FullName", "Newer", 2000);
  await save("parent1FirstName", "Older", 1000);

  const db = await runMockMigration(migration, 5);
  expect((await db.get(FORM_DATA_STORE, "mothersLastName"))?.value).toBe(
    "Newer",
  );
  expect((await db.get(FORM_DATA_STORE, "parent1FirstName"))?.value).toBe(
    "Newer",
  );
  expect(await db.get(FORM_DATA_STORE, "mothersMaidenName")).toBeUndefined();
  db.close();
});
