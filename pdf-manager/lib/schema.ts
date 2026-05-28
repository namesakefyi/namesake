import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import { escapeKey } from "../../scripts/utils.mjs";
import { fieldReadingOrder } from "./pdf.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PDFS_DIR = join(ROOT, "src/pdfs");

interface PdfFieldWithClass {
  name: string;
  fieldClass: string;
}

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

async function extractFieldsWithClass(
  pdfPath: string,
): Promise<PdfFieldWithClass[]> {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const sorted = fieldReadingOrder(form.getFields(), doc.getPages());
  return sorted.map((f) => ({
    name: f.getName(),
    fieldClass: f.constructor.name,
  }));
}

/** Reads the active field names (pdfSchema keys) from an existing schema.ts. */
function loadActiveFieldNames(schemaPath: string): Set<string> {
  if (!existsSync(schemaPath)) return new Set();
  try {
    const content = readFileSync(schemaPath, "utf8");
    const names = new Set<string>();
    for (const m of content.matchAll(
      /^\s+(?:([a-zA-Z_]\w*)|("(?:[^"\\]|\\.)*")):\s*PDF/gm,
    )) {
      names.add(m[1] ?? JSON.parse(m[2]));
    }
    return names;
  } catch {
    return new Set();
  }
}

/** Reads the current exclusion set from schema.ts for a PDF directory. */
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

/** Returns schema.ts file content as a string. */
function generateTypesContent(
  stem: string,
  fields: PdfFieldWithClass[],
  excluded: Set<string> = new Set(),
): string {
  const usedClasses = [...new Set(fields.map((f) => f.fieldClass))];
  const imports =
    usedClasses.length > 0
      ? `import { ${usedClasses.sort().join(", ")} } from "@cantoo/pdf-lib";`
      : "";
  const schemaEntries = fields
    .map((f) => `  ${escapeKey(f.name)}: ${f.fieldClass}`)
    .join(",\n");
  const schemaBody = schemaEntries ? `\n${schemaEntries},\n` : "\n";

  const sortedExcludes = [...excluded].sort();
  const excludedSection =
    sortedExcludes.length > 0
      ? `\n/** Fields present in the PDF but excluded from the schema */\nexport const pdfExcludedFields = ${JSON.stringify(sortedExcludes)} as const;\n`
      : "";

  return `/** Auto-generated from ${stem}.pdf — do not edit */
${imports}

export const pdfSchema = {${schemaBody}} as const;

export type PdfFieldName = keyof typeof pdfSchema;
${excludedSection}`;
}

export interface ProcessPdfResult {
  path: string;
  displayPath: string;
  count: number;
  checkboxCount: number;
}

/**
 * Writes schema.ts next to the PDF, omitting any excluded fields.
 * Pass `exclude` to add new field names to the exclusion set (merged with any
 * previously excluded fields already recorded in schema.ts).
 * Returns { path, displayPath, count, checkboxCount }.
 */
export async function processPdf(
  pdfPath: string,
  { exclude = [] }: { exclude?: string[] } = {},
): Promise<ProcessPdfResult> {
  const dir = dirname(pdfPath);
  const filename = basename(pdfPath);
  const stem = filename.slice(0, -extname(filename).length);
  const schemaPath = join(dir, "schema.ts");

  const excluded = loadExclusions(dir);
  for (const n of exclude) excluded.add(n);

  const allFields = await extractFieldsWithClass(pdfPath);

  // When updating an existing schema, auto-exclude any PDF field that is
  // unknown — not currently active and not already excluded. This prevents
  // unmapped PDF fields from silently appearing in the generated schema.
  if (existsSync(schemaPath)) {
    const activeNames = loadActiveFieldNames(schemaPath);
    for (const f of allFields) {
      if (!excluded.has(f.name) && !activeNames.has(f.name)) {
        excluded.add(f.name);
      }
    }
  }

  const fields = allFields.filter((f) => !excluded.has(f.name));
  writeFileSync(schemaPath, generateTypesContent(stem, fields, excluded));

  const displayPath = relative(PDFS_DIR, join(dir, stem));
  const checkboxCount = fields.filter(
    (f) => f.fieldClass === "PDFCheckBox",
  ).length;
  return { path: schemaPath, displayPath, count: fields.length, checkboxCount };
}
