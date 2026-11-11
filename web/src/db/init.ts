import { openDB } from "idb";
import { migrations } from "./migrations";
import type { Migration, NamesakeDB, NamesakeDBSchema } from "./types";

export const DB_NAME = "namesake";
export const DB_VERSION = 5;

export { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "./types";

let dbPromise: Promise<NamesakeDB> | null = null;

// Runs each migration only after the previous one finishes. If one fails, the
// upgrade is aborted so the database stays at its old version, unchanged.
async function runMigrations(
  db: NamesakeDB,
  transaction: Parameters<Migration>[1],
  fromVersion: number,
  toVersion: number,
): Promise<void> {
  try {
    for (let version = fromVersion; version < toVersion; version++) {
      await migrations[version]?.(db, transaction);
    }
  } catch (error) {
    console.error(
      `IndexedDB migration to v${toVersion} failed; aborting upgrade:`,
      error,
    );
    // getDB already rejects with the abort, so this copy needs no handler.
    transaction.done.catch(() => {});
    try {
      transaction.abort();
    } catch {
      // The transaction already aborted itself because a request failed.
    }
  }
}

// Caches the open in progress too, so callers racing on first load share one
// connection.
export function getDB(): Promise<NamesakeDB> {
  dbPromise ??= openDB<NamesakeDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      runMigrations(db, transaction, oldVersion, newVersion ?? DB_VERSION);
    },
    blocked(currentVersion, blockedVersion) {
      console.warn(
        `IndexedDB upgrade blocked (v${currentVersion} open elsewhere, needs v${blockedVersion})`,
      );
    },
    blocking(currentVersion, blockedVersion, event) {
      console.warn(
        `IndexedDB: closing to allow upgrade (v${currentVersion} → v${blockedVersion})`,
      );
      (event.target as IDBDatabase).close();
      dbPromise = null;
    },
  }).catch((error) => {
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}
