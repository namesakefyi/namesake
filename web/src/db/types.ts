import type { IDBPDatabase, IDBPTransaction } from "idb";

export const FORM_DATA_STORE = "formData";
export const FORM_PROGRESS_STORE = "formProgress";

export interface FormFieldRecord {
  field: string;
  value: any;
  createdAt: number;
  updatedAt: number;
}

export interface FormProgressRecord {
  formSlug: string;
  machineState: unknown;
  updatedAt: number;
}

export type NamesakeDBSchema = {
  formData: { key: string; value: FormFieldRecord };
  formProgress: { key: string; value: FormProgressRecord };
};

export type NamesakeDB = IDBPDatabase<NamesakeDBSchema>;

export type Migration = (
  db: IDBPDatabase<NamesakeDBSchema>,
  tx: IDBPTransaction<
    NamesakeDBSchema,
    Array<keyof NamesakeDBSchema>,
    "versionchange"
  >,
) => void | Promise<void>;
