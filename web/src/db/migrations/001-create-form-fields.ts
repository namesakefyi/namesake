import type { DBSchema, IDBPDatabase } from "idb";
import type { FormFieldRecord, Migration } from "../types";

// v1 schema: the original store was named formFields
interface FormFieldsSchema extends DBSchema {
  formFields: { key: string; value: FormFieldRecord };
}

export const migration: Migration = (db) => {
  const v1Db = db as unknown as IDBPDatabase<FormFieldsSchema>;
  if (!v1Db.objectStoreNames.contains("formFields")) {
    v1Db.createObjectStore("formFields", { keyPath: "field" });
  }
};
