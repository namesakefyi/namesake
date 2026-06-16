import type { DBSchema, IDBPDatabase, IDBPTransaction } from "idb";
import type { FormFieldRecord, Migration } from "../types";
import { FORM_DATA_STORE, FORM_PROGRESS_STORE } from "../types";

// v1 schema used for casting during this migration
interface FormFieldsSchema extends DBSchema {
  formFields: { key: string; value: FormFieldRecord };
}

export const migration: Migration = (db, tx) => {
  if ((db as unknown as IDBPDatabase).objectStoreNames.contains("formFields")) {
    // Cast to v1 schema to access the legacy store, then rename it.
    // IDB's name setter is an atomic in-place rename that preserves all records.
    const v1Tx = tx as unknown as IDBPTransaction<
      FormFieldsSchema,
      ["formFields"],
      "versionchange"
    >;
    (v1Tx.objectStore("formFields") as unknown as IDBObjectStore).name =
      FORM_DATA_STORE;
  } else if (!db.objectStoreNames.contains(FORM_DATA_STORE)) {
    // Defensive fallback for DBs in unexpected intermediate states
    db.createObjectStore(FORM_DATA_STORE, { keyPath: "field" });
  }

  if (!db.objectStoreNames.contains(FORM_PROGRESS_STORE)) {
    db.createObjectStore(FORM_PROGRESS_STORE, { keyPath: "formSlug" });
  }
};
