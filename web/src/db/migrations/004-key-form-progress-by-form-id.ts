import type { IDBPDatabase, IDBPTransaction } from "idb";
import { RENAMED_FORM_IDS } from "#constants/renamedFormIds";
import type { FormProgressRecord, Migration } from "../types";
import { FORM_PROGRESS_STORE } from "../types";

interface LegacyProgressRecord {
  formSlug: string;
  machineState: unknown;
  updatedAt: number;
}

function migrateSnapshot(machineState: unknown, formId: string): unknown {
  const snapshot = machineState as { context?: Record<string, unknown> };
  if (!snapshot?.context) return machineState;
  const { formSlug: _formSlug, ...context } = snapshot.context;
  return { ...snapshot, context: { ...context, formId } };
}

// Forms moved into jurisdiction folders, so their ids now include the
// jurisdiction. Saved progress was keyed by `formSlug`; it's now keyed by
// `formId`, and the machine snapshot's context field is renamed to match.
// IndexedDB can't change a store's key path, so the store is recreated.
export const migration: Migration = async (db, tx) => {
  const rawDb = db as unknown as IDBPDatabase;
  const rawTx = tx as unknown as IDBPTransaction<any, any, "versionchange">;

  let records: LegacyProgressRecord[] = [];
  if (rawDb.objectStoreNames.contains(FORM_PROGRESS_STORE)) {
    const store = rawTx.objectStore(FORM_PROGRESS_STORE);
    if (store.keyPath === "formId") return;
    records = await store.getAll();
    rawDb.deleteObjectStore(FORM_PROGRESS_STORE);
  }

  rawDb.createObjectStore(FORM_PROGRESS_STORE, { keyPath: "formId" });
  const migrated = new Map<string, FormProgressRecord>();
  for (const { formSlug, machineState, updatedAt } of records) {
    const formId = RENAMED_FORM_IDS[formSlug] ?? formSlug;
    const existing = migrated.get(formId);
    if (existing && existing.updatedAt >= updatedAt) continue;
    migrated.set(formId, {
      formId,
      machineState: migrateSnapshot(machineState, formId),
      updatedAt,
    });
  }
  for (const record of migrated.values()) {
    await rawTx.objectStore(FORM_PROGRESS_STORE).put(record);
  }
};
