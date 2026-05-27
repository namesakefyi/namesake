import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import { escapeKey } from "../../scripts/utils.mjs";
import { fieldReadingOrder } from "./pdf.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PDFS_DIR = join(ROOT, "src/pdfs");

/** Recursively finds all .pdf files under dir. */
export function findPdfFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findPdfFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".pdf"))
      files.push(fullPath);
  }
  return files;
}

async function extractFieldsWithClass(pdfPath) {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const sorted = fieldReadingOrder(form.getFields(), doc.getPages());
  return sorted.map((f) => ({
    name: f.getName(),
    fieldClass: f.constructor.name,
  }));
}

/** Returns schema.ts file content as a string. */
export function generateTypesContent(stem, fields) {
  const usedClasses = [...new Set(fields.map((f) => f.fieldClass))];
  const imports =
    usedClasses.length > 0
      ? `import { ${usedClasses.sort().join(", ")} } from "@cantoo/pdf-lib";`
      : "";
  const schemaEntries = fields
    .map((f) => `  ${escapeKey(f.name)}: ${f.fieldClass}`)
    .join(",\n");
  const schemaBody = schemaEntries ? `\n${schemaEntries},\n` : "\n";
  return `/** Auto-generated from ${stem}.pdf — do not edit */
${imports}

export const pdfSchema = {${schemaBody}} as const;

export type PdfFieldName = keyof typeof pdfSchema;
`;
}

/** Writes schema.ts next to the PDF. Returns { path, displayPath, count, checkboxCount }. */
export async function processPdf(pdfPath) {
  const dir = dirname(pdfPath);
  const filename = basename(pdfPath);
  const stem = filename.slice(0, -extname(filename).length);
  const schemaPath = join(dir, "schema.ts");

  const fields = await extractFieldsWithClass(pdfPath);
  writeFileSync(schemaPath, generateTypesContent(stem, fields));

  const displayPath = relative(PDFS_DIR, join(dir, stem));
  const checkboxCount = fields.filter(
    (f) => f.fieldClass === "PDFCheckBox",
  ).length;
  return { path: schemaPath, displayPath, count: fields.length, checkboxCount };
}
