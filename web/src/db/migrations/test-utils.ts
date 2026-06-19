import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import { DB_NAME } from "../init";
import type { Migration } from "../types";

/**
 * Applies a single migration function in isolation against fake-indexeddb.
 *
 * If `setup` is provided, a DB is first created at (toVersion - 1) using that
 * function to establish the pre-migration schema. Then the DB is opened at
 * `toVersion` with only the given migration applied in the upgrade callback.
 *
 * @example
 * // Apply migration to a blank DB
 * const db = await runMockMigration(migration, 1);
 *
 * @example
 * // Apply migration from a specific prior schema state
 * const db = await runMockMigration(migration, 2, (db) => {
 *   db.createObjectStore("formFields", { keyPath: "field" });
 * });
 */
export async function runMockMigration(
  migration: Migration,
  toVersion: number,
  setup?: (db: any) => void,
): Promise<IDBPDatabase<any>> {
  const fromVersion = toVersion - 1;

  if (setup && fromVersion > 0) {
    const prevDb = await openDB(DB_NAME, fromVersion, {
      upgrade(db) {
        setup(db);
      },
    });
    prevDb.close();
  }

  return openDB(DB_NAME, toVersion, {
    async upgrade(db, _oldVersion, _newVersion, tx) {
      await migration(db as any, tx as any);
    },
  });
}

/**
 * Writes a record directly into an existing DB store using idb.
 *
 * Call this after the DB schema exists (e.g. after `runMockMigration`) to
 * seed data for tests that verify record preservation across migrations.
 */
export async function writeMockRecord(
  dbVersion: number,
  storeName: string,
  record: object,
): Promise<void> {
  const db = await openDB(DB_NAME, dbVersion);
  // openDB without a schema generic returns IDBPDatabase<unknown>, so storeName
  // can't be statically verified — the cast is intentional.
  const tx = (db as any).transaction(storeName, "readwrite");
  await tx.objectStore(storeName).put(record);
  await tx.done;
  db.close();
}

/**
 * Creates a mock db object for idempotency tests.
 *
 * Stores listed in `existingStores` are reported as already present.
 * `createObjectStore` and `deleteObjectStore` throw if called — migrations
 * must skip those operations when the target state already exists.
 */
export function makeMockDb(existingStores: string[]): any {
  return {
    objectStoreNames: {
      contains: (name: string) => existingStores.includes(name),
    },
    createObjectStore: () => {
      throw new Error("createObjectStore should not be called");
    },
    deleteObjectStore: () => {
      throw new Error("deleteObjectStore should not be called");
    },
  };
}
