import { SHARED_FIELDS } from "../../web/src/constants/fields.ts";
import { JURISDICTIONS } from "../../web/src/constants/jurisdictions.ts";
import { escapeKey } from "./utils.ts";

/** Common PDF field name → form field name mappings. */
const PDF_TO_FORM_FIELD_MAP: Record<string, string> = {
  petitionerFirstName: "oldFirstName",
  petitionerMiddleName: "oldMiddleName",
  petitionerLastName: "oldLastName",
  county: "residenceCounty",
};

export interface Jurisdiction {
  id: string;
  name: string;
}

export const jurisdictions: readonly Jurisdiction[] = Object.entries(
  JURISDICTIONS,
).map(([id, { name }]) => ({ id, name }));

/** The shared field a PDF field most likely holds, if any. */
function matchSharedField(pdfFieldName: string): string | undefined {
  const isShared = (name: string) => Object.hasOwn(SHARED_FIELDS, name);
  if (isShared(pdfFieldName)) return pdfFieldName;
  return PDF_TO_FORM_FIELD_MAP[pdfFieldName];
}

/**
 * Lines of a starter `fill` body: a shared field of the same name fills its
 * PDF field, and every other field starts as `undefined`.
 */
export function buildFillEntries(pdfFieldNames: readonly string[]): string[] {
  return pdfFieldNames.map((name) => {
    const field = matchSharedField(name);
    return `    ${escapeKey(name)}: ${field ? `data.${field}` : "undefined"},`;
  });
}
