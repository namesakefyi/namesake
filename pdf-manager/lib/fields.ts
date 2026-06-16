import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const FIELDS_PATH = join(ROOT, "web/src/constants/fields.ts");
const JURISDICTIONS_PATH = join(ROOT, "web/src/constants/jurisdictions.ts");

/** Common PDF field name → form field name mappings. */
const PDF_TO_FORM_FIELD_MAP: Record<string, string> = {
  petitionerFirstName: "oldFirstName",
  petitionerMiddleName: "oldMiddleName",
  petitionerLastName: "oldLastName",
  county: "residenceCounty",
};

export interface FormField {
  name: string;
  type: string;
}

export interface Jurisdiction {
  name: string;
  abbreviation: string;
}

let _formFields: FormField[] | null = null;
let _jurisdictions: Jurisdiction[] | null = null;

/** Returns { name, type }[] parsed from FIELD_DEFS in fields.ts. */
export function loadFormFields(): FormField[] {
  if (_formFields) return _formFields;
  const content = readFileSync(FIELDS_PATH, "utf8");
  const regex =
    /\{\s*name:\s*"([^"]+)"[^}]*type:\s*"(string|boolean|string\[\])"/g;
  const result: FormField[] = [];
  for (const m of content.matchAll(regex)) {
    result.push({ name: m[1], type: m[2] });
  }
  _formFields = result;
  return _formFields;
}

export function loadJurisdictions(): Jurisdiction[] {
  if (_jurisdictions) return _jurisdictions;
  const content = readFileSync(JURISDICTIONS_PATH, "utf8");
  const regex = /\{\s*name:\s*"([^"]+)",\s*abbreviation:\s*"([^"]+)"/g;
  const result: Jurisdiction[] = [];
  for (const m of content.matchAll(regex)) {
    result.push({ name: m[1], abbreviation: m[2] });
  }
  _jurisdictions = result;
  return _jurisdictions;
}

function pdfFieldToFormField(
  pdfFieldName: string,
  formFieldsByName: Map<string, FormField>,
): string | null {
  if (formFieldsByName.has(pdfFieldName)) return pdfFieldName;
  if (PDF_TO_FORM_FIELD_MAP[pdfFieldName])
    return PDF_TO_FORM_FIELD_MAP[pdfFieldName];
  const base = pdfFieldName.replace(/(True|False)$/, "");
  if (formFieldsByName.has(base)) return base;
  return null;
}

function getPlaceholderForField(formField: FormField): string | true {
  const { name, type } = formField;
  if (type === "boolean") return true;
  if (type === "string[]") return '["placeholder"]';
  if (name === "dateOfBirth") return '"1990-01-01"';
  if (name === "email") return '"test@example.com"';
  if (name === "phoneNumber") return '"555-555-5555"';
  if (name === "language") return '"es"';
  if (name.includes("ZipCode") || name.includes("Zip")) return '"02139"';
  if (name.includes("State")) return '"MA"';
  return '"placeholder"';
}

export function buildTestDataEntries(
  pdfFields: Array<{ name: string }>,
  formFields: FormField[],
): string[] {
  const formFieldsByName = new Map(formFields.map((f) => [f.name, f]));
  const seen = new Set<string>();
  const lines: string[] = [];
  const unmapped: string[] = [];

  for (const pdfField of pdfFields) {
    const formFieldName = pdfFieldToFormField(pdfField.name, formFieldsByName);
    if (!formFieldName) {
      unmapped.push(pdfField.name);
      continue;
    }
    if (seen.has(formFieldName)) continue;
    seen.add(formFieldName);
    const formField = formFieldsByName.get(formFieldName);
    if (!formField) continue;
    const value = getPlaceholderForField(formField);
    lines.push(`    ${formFieldName}: ${value},`);
  }

  if (unmapped.length > 0) {
    lines.push(
      "",
      `    // TODO: map PDF fields to form data: ${unmapped.join(", ")}`,
    );
  }
  return lines;
}
