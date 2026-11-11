import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SHARED_FIELDS } from "../../web/src/constants/fields.ts";
import { escapeKey } from "./utils.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const JURISDICTIONS_PATH = join(ROOT, "web/src/constants/jurisdictions.ts");

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

let _jurisdictions: Jurisdiction[] | null = null;

export function loadJurisdictions(): Jurisdiction[] {
  if (_jurisdictions) return _jurisdictions;
  const content = readFileSync(JURISDICTIONS_PATH, "utf8");
  const regex = /^\s*(\w{2}):\s*\{\s*name:\s*"([^"]+)"/gm;
  _jurisdictions = [...content.matchAll(regex)].map(([, id, name]) => ({
    id,
    name,
  }));
  return _jurisdictions;
}

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
