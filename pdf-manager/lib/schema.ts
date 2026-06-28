import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { PDFS_DIR } from "./catalog";
import {
  convertDropdownsToTextFields,
  extractFields,
  type PdfFieldInfo,
} from "./pdf";
import { escapeKey } from "./utils";

// These types cannot be filled by Namesake and are excluded from generated schemas
const NON_FILLABLE_TYPES = new Set([
  "signature",
  "listbox",
  "unknown",
  "non-terminal",
]);

/** Recursively finds all .pdf files under dir. */
export function findPdfFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findPdfFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".pdf"))
      files.push(fullPath);
  }
  return files;
}

export function loadExclusions(pdfDir: string): Set<string> {
  const schemaPath = join(pdfDir, "schema.ts");
  if (!existsSync(schemaPath)) return new Set();
  try {
    const content = readFileSync(schemaPath, "utf8");
    const match = content.match(
      /export const pdfExcludedFields\s*=\s*(\[[\s\S]*?\])\s*as const/,
    );
    if (!match) return new Set();
    // Strip trailing commas (Biome formatter adds them, breaking JSON.parse)
    return new Set(JSON.parse(match[1].replace(/,(\s*\])/g, "$1")));
  } catch {
    return new Set();
  }
}

function generateTypesContent(
  stem: string,
  fields: PdfFieldInfo[],
  excluded: Set<string> = new Set(),
): string {
  const schemaEntries = fields
    .map((f) => `  ${escapeKey(f.name)}: "${f.type}"`)
    .join(",\n");
  const schemaBody = schemaEntries ? `\n${schemaEntries},\n` : "\n";

  const sortedExcludes = [...excluded].sort();
  const excludedSection =
    sortedExcludes.length > 0
      ? `\n/** Fields present in the PDF but excluded from the schema */\nexport const pdfExcludedFields = ${JSON.stringify(sortedExcludes)} as const;\n`
      : "";

  return `/** Auto-generated from ${stem}.pdf — do not edit */

import type { PdfFieldType } from "#constants/pdf";

export const pdfSchema = {${schemaBody}} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;
${excludedSection}`;
}

export interface ProcessPdfResult {
  path: string;
  displayPath: string;
  fieldNames: string[];
  count: number;
  checkboxCount: number;
}

/**
 * Writes schema.ts next to the PDF, omitting any excluded fields.
 * Pass `exclude` to add new field names to the exclusion set (merged with any
 * previously excluded fields already recorded in schema.ts).
 * Pass `keep` to declare which fields should remain active — any field present
 * in the PDF but absent from `keep` (and not in `unexclude`) will be
 * auto-excluded when a schema already exists.
 * Returns the written path, display path, and final field list.
 */
export async function processPdf(
  pdfPath: string,
  {
    exclude = [],
    keep = [],
    unexclude = [],
  }: { exclude?: string[]; keep?: string[]; unexclude?: string[] } = {},
): Promise<ProcessPdfResult> {
  const dir = dirname(pdfPath);
  const filename = basename(pdfPath);
  const stem = filename.slice(0, -extname(filename).length);
  const schemaPath = join(dir, "schema.ts");

  const excluded = loadExclusions(dir);
  for (const n of unexclude) excluded.delete(n);
  for (const n of exclude) excluded.add(n);

  await convertDropdownsToTextFields(pdfPath);
  const allFields = await extractFields(pdfPath);

  // Always exclude non-fillable field types (signature, listbox, etc.)
  for (const f of allFields) {
    if (NON_FILLABLE_TYPES.has(f.type)) excluded.add(f.name);
  }

  // When a schema already exists, auto-exclude any field not in `keep` or
  // `unexclude` — the caller is responsible for passing what should stay active.
  if (existsSync(schemaPath)) {
    const keepSet = new Set([...keep, ...unexclude]);
    for (const f of allFields) {
      if (!excluded.has(f.name) && !keepSet.has(f.name)) {
        excluded.add(f.name);
      }
    }
  }

  const fields = allFields.filter((f) => !excluded.has(f.name));
  writeFileSync(schemaPath, generateTypesContent(stem, fields, excluded));

  const displayPath = relative(PDFS_DIR, join(dir, stem));
  const fieldNames = fields.map((f) => f.name);
  const checkboxCount = fields.filter((f) => f.type === "checkbox").length;
  return {
    path: schemaPath,
    displayPath,
    fieldNames,
    count: fields.length,
    checkboxCount,
  };
}
