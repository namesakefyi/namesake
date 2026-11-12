import type { FieldType } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import type { FormData } from "#lib/forms/questions";
import { allForms } from "../allForms";
import { getFormFields } from "../getStepFields";

export const forms = Object.entries(allForms);

/** Each field a form asks, with its type. */
export const getAskedFields = (config: FormConfig): Map<string, FieldType> =>
  new Map(getFormFields(config.steps).map((field) => [field.id, field.type]));

/** Answer sets to trace with, so more branches of each function run. */
const SAMPLES: readonly ((type: FieldType) => unknown)[] = [
  () => undefined,
  (type) =>
    type === "bool" ? true : type === "list" ? ["other"] : "1990-01-01",
  (type) => (type === "bool" ? false : type === "list" ? [] : ""),
];

/**
 * The fields a function reads, found by calling it with recording proxies.
 * Fields of `types` get sample answers; any other name is still recorded,
 * so misspelled or removed fields show up.
 */
export function getFieldsReadBy(
  read: (data: FormData) => unknown,
  types: ReadonlyMap<string, FieldType>,
): string[] {
  const fields = new Set<string>();
  for (const sample of SAMPLES) {
    const data = new Proxy({} as FormData, {
      get(_target, property) {
        if (typeof property !== "string") return undefined;
        fields.add(property);
        const type = types.get(property);
        return type ? sample(type) : undefined;
      },
    });
    try {
      read(data);
    } catch {
      // Reads made before the error still count.
    }
  }
  return [...fields];
}
