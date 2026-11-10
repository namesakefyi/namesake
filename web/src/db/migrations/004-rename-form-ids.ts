import type { FormProgressRecord, Migration } from "../types";
import { FORM_PROGRESS_STORE } from "../types";

// Forms moved into jurisdiction folders, which changed their ids. Saved
// progress is keyed by form id, and the machine snapshot stores it too.
export const RENAMED_FORM_IDS: Record<string, string> = {
  "court-order-ma": "ma/court-order",
  "court-order-ma-minor": "ma/court-order-minor",
  "affidavit-of-indigency-ma": "ma/affidavit-of-indigency",
  "birth-certificate-affidavit-ma": "ma/birth-certificate-affidavit",
  "court-order-ny": "ny/court-order",
  "court-order-ri": "ri/court-order",
};

function renameSnapshot(machineState: unknown, formSlug: string): unknown {
  const snapshot = machineState as { context?: Record<string, unknown> };
  if (!snapshot?.context) return machineState;
  return { ...snapshot, context: { ...snapshot.context, formSlug } };
}

export const migration: Migration = async (db, tx) => {
  if (!db.objectStoreNames.contains(FORM_PROGRESS_STORE)) return;

  const store = tx.objectStore(FORM_PROGRESS_STORE);
  for (const [oldId, newId] of Object.entries(RENAMED_FORM_IDS)) {
    const record = await store.get(oldId);
    if (!record) continue;

    if (!(await store.get(newId))) {
      await store.put({
        ...record,
        formSlug: newId,
        machineState: renameSnapshot(record.machineState, newId),
      } satisfies FormProgressRecord);
    }
    await store.delete(oldId);
  }
};
