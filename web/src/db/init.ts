import { openDB } from "idb";
import { migrations } from "./migrations";
import type { NamesakeDB, NamesakeDBSchema } from "./types";

export const DB_NAME = "namesake";
export const DB_VERSION = 3;

export { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "./types";

let dbInstance: NamesakeDB | null = null;

export async function getDB(): Promise<NamesakeDB> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<NamesakeDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        for (let v = oldVersion; v < (newVersion ?? DB_VERSION); v++) {
          migrations[v]?.(db, transaction);
        }
      },
      blocked(currentVersion, blockedVersion) {
        console.warn(
          `IndexedDB upgrade blocked (v${currentVersion} open elsewhere, needs v${blockedVersion})`,
        );
      },
      blocking(currentVersion, blockedVersion) {
        console.warn(
          `IndexedDB: closing to allow upgrade (v${currentVersion} → v${blockedVersion})`,
        );
        dbInstance?.close();
        dbInstance = null;
      },
    });
  } catch (error) {
    dbInstance = null;
    throw error;
  }

  return dbInstance;
}
