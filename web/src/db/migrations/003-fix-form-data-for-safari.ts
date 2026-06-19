import type { IDBPDatabase, IDBPTransaction } from "idb";
import type { FormFieldRecord, Migration } from "../types";
import { FORM_DATA_STORE } from "../types";

// Safari iOS < 14.5 silently ignores the IDBObjectStore.name setter, so
// migration 002's rename of formFields → formData was a no-op on those devices.
// The DB was still bumped to v2, leaving it with formFields + formProgress but
// no formData, causing all saves to fail with NotFoundError.
// This migration detects that stuck state and repairs it by manually creating
// formData, copying records from formFields, then deleting formFields.

interface LegacySchema {
  formFields: { key: string; value: FormFieldRecord };
}

export const migration: Migration = async (db, tx) => {
  const rawDb = db as unknown as IDBPDatabase<LegacySchema>;
  const rawTx = tx as unknown as IDBPTransaction<
    LegacySchema,
    ["formFields"],
    "versionchange"
  >;

  if (
    rawDb.objectStoreNames.contains("formFields") &&
    !rawDb.objectStoreNames.contains(FORM_DATA_STORE)
  ) {
    (db as unknown as IDBPDatabase).createObjectStore(FORM_DATA_STORE, {
      keyPath: "field",
    });
    const records = await rawTx.objectStore("formFields").getAll();
    const newTx = tx as unknown as IDBPTransaction<any, any, "versionchange">;
    for (const record of records) {
      await newTx.objectStore(FORM_DATA_STORE).put(record);
    }
    rawDb.deleteObjectStore("formFields");
  }
};
