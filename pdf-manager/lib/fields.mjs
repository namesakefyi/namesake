import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const FIELDS_PATH = join(ROOT, "src/constants/fields.ts");
const JURISDICTIONS_PATH = join(ROOT, "src/constants/jurisdictions.ts");

/** Common PDF field name → form field name mappings. */
const PDF_TO_FORM_FIELD_MAP = {
  petitionerFirstName: "oldFirstName",
  petitionerMiddleName: "oldMiddleName",
  petitionerLastName: "oldLastName",
  county: "residenceCounty",
};

/** Returns { name, type }[] parsed from FIELD_DEFS in fields.ts. */
export function loadFormFields() {
  const content = readFileSync(FIELDS_PATH, "utf8");
  const regex =
    /\{\s*name:\s*"([^"]+)"[^}]*type:\s*"(string|boolean|string\[\])"/g;
  const result = [];
  for (const m of content.matchAll(regex)) {
    result.push({ name: m[1], type: m[2] });
  }
  return result;
}

/** Returns { name, abbreviation }[] from jurisdictions.ts. */
export function loadJurisdictions() {
  const content = readFileSync(JURISDICTIONS_PATH, "utf8");
  const regex = /\{\s*name:\s*"([^"]+)",\s*abbreviation:\s*"([^"]+)"/g;
  const result = [];
  for (const m of content.matchAll(regex)) {
    result.push({ name: m[1], abbreviation: m[2] });
  }
  return result;
}

/** Maps a PDF field name to a form field name, or null if no match. */
export function pdfFieldToFormField(pdfFieldName, formFieldsByName) {
  if (formFieldsByName.has(pdfFieldName)) return pdfFieldName;
  if (PDF_TO_FORM_FIELD_MAP[pdfFieldName])
    return PDF_TO_FORM_FIELD_MAP[pdfFieldName];
  const base = pdfFieldName.replace(/(True|False)$/, "");
  if (formFieldsByName.has(base)) return base;
  return null;
}

/** Returns a placeholder value string for a form field. */
function getPlaceholderForField(formField) {
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

/** Builds testData entry lines from PDF fields mapped to form fields. */
export function buildTestDataEntries(pdfFields, formFields) {
  const formFieldsByName = new Map(formFields.map((f) => [f.name, f]));
  const seen = new Set();
  const lines = [];
  const unmapped = [];

  for (const pdfField of pdfFields) {
    const formFieldName = pdfFieldToFormField(pdfField.name, formFieldsByName);
    if (!formFieldName) {
      unmapped.push(pdfField.name);
      continue;
    }
    if (seen.has(formFieldName)) continue;
    seen.add(formFieldName);
    const formField = formFields.find((f) => f.name === formFieldName);
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
