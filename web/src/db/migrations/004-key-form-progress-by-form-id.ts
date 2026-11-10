import type { IDBPDatabase, IDBPTransaction } from "idb";
import { RENAMED_FORM_IDS } from "#constants/renamedFormIds";
import type { Migration } from "../types";
import { FORM_PROGRESS_STORE } from "../types";

// Forms moved into jurisdiction folders, so their ids now include the
// jurisdiction. Saved progress was keyed by `formSlug`; it's now keyed by
// `formId`. IndexedDB can't change a store's key path, so the store is
// recreated.
export const migration: Migration = async (db, tx) => {
  const rawDb = db as unknown as IDBPDatabase;
  const rawTx = tx as unknown as IDBPTransaction<any, any, "versionchange">;

  const records = await rawTx.objectStore(FORM_PROGRESS_STORE).getAll();
  rawDb.deleteObjectStore(FORM_PROGRESS_STORE);
  const store = rawDb.createObjectStore(FORM_PROGRESS_STORE, {
    keyPath: "formId",
  });
  await Promise.all(
    records.map(({ formSlug, ...record }) =>
      store.put({ ...record, formId: RENAMED_FORM_IDS[formSlug] ?? formSlug }),
    ),
  );
};
