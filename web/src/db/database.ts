import { FORM_DATA_STORE, FORM_PROGRESS_STORE, getDB } from "./init";
import type { FormFieldRecord } from "./types";

export async function saveField(field: string, value: any): Promise<void> {
  const db = await getDB();
  const existing = await db.get(FORM_DATA_STORE, field);
  const now = Date.now();

  await db.put(FORM_DATA_STORE, {
    field,
    value,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

export async function getField(field: string): Promise<any | undefined> {
  const db = await getDB();
  const record = await db.get(FORM_DATA_STORE, field);
  return record?.value;
}

export async function getFieldsByNames(
  fields: string[],
): Promise<FormFieldRecord[]> {
  const db = await getDB();
  const records: FormFieldRecord[] = [];

  for (const field of fields) {
    const record = await db.get(FORM_DATA_STORE, field);
    if (record) {
      records.push(record);
    }
  }

  return records;
}

export async function deleteField(field: string): Promise<void> {
  const db = await getDB();
  await db.delete(FORM_DATA_STORE, field);
}

export async function clearAllFields(): Promise<void> {
  const db = await getDB();
  await db.clear(FORM_DATA_STORE);
}

export async function getAllFields(): Promise<FormFieldRecord[]> {
  const db = await getDB();
  return db.getAll(FORM_DATA_STORE);
}

export async function saveFormProgress(
  formSlug: string,
  machineState: unknown,
): Promise<void> {
  const db = await getDB();
  await db.put(FORM_PROGRESS_STORE, {
    formSlug,
    machineState,
    updatedAt: Date.now(),
  });
}

export async function getFormProgress(
  formSlug: string,
): Promise<unknown | undefined> {
  const db = await getDB();
  const record = await db.get(FORM_PROGRESS_STORE, formSlug);
  return record?.machineState;
}

export async function clearFormProgress(formSlug: string): Promise<void> {
  const db = await getDB();
  await db.delete(FORM_PROGRESS_STORE, formSlug);
}
