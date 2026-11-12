import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JURISDICTIONS } from "../../web/src/constants/jurisdictions.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "../..");
export const PDFS_DIR = join(ROOT, "web/src/content/pdfs");

interface PdfMeta {
  title: string;
  code: string;
  canonicalUrl: string;
}

export interface PdfEntry {
  id: string;
  jurisdiction: string;
  title: string;
  code: string;
  canonicalUrl: string;
  fieldCount: number;
  pdfPath: string;
  pdfDir: string;
}

/** Parses index.ts for PDF metadata via regex. */
function parsePdfMetadata(pdfDir: string): PdfMeta | null {
  const indexPath = join(pdfDir, "index.ts");
  if (!existsSync(indexPath)) return null;
  const content = readFileSync(indexPath, "utf8");
  return {
    title: content.match(/\btitle:\s*"([^"]+)"/)?.[1] ?? "",
    code: content.match(/\bcode:\s*"([^"]+)"/)?.[1] ?? "",
    canonicalUrl: content.match(/\bcanonicalUrl:\s*"([^"]+)"/)?.[1] ?? "",
  };
}

/** Counts active fields in schema.ts by counting string-literal type values. */
function countSchemaFields(pdfDir: string): number {
  const schemaPath = join(pdfDir, "schema.ts");
  if (!existsSync(schemaPath)) return 0;
  const content = readFileSync(schemaPath, "utf8");
  return (content.match(/:\s*"(?:text|checkbox|radio|button)"/g) ?? []).length;
}

export const FEDERAL = "federal";

function findPdfFile(dir: string): string | undefined {
  return readdirSync(dir).find((file) => file.endsWith(".pdf"));
}

/**
 * Lists each PDF folder with its jurisdiction. A folder named after a
 * jurisdiction holds that jurisdiction's PDFs; any other folder at the root of
 * PDFS_DIR is a federal PDF.
 */
function listPdfDirs() {
  const result: { jurisdiction: string; id: string; pdfDir: string }[] = [];
  for (const entry of readdirSync(PDFS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(PDFS_DIR, entry.name);
    if (!Object.hasOwn(JURISDICTIONS, entry.name)) {
      result.push({ jurisdiction: FEDERAL, id: entry.name, pdfDir: dir });
      continue;
    }
    for (const pdfEntry of readdirSync(dir, { withFileTypes: true })) {
      if (!pdfEntry.isDirectory()) continue;
      result.push({
        jurisdiction: entry.name,
        id: pdfEntry.name,
        pdfDir: join(dir, pdfEntry.name),
      });
    }
  }
  return result;
}

export function jurisdictionDir(jurisdiction: string): string {
  const id = jurisdiction.toLowerCase();
  return id === FEDERAL ? PDFS_DIR : join(PDFS_DIR, id);
}

export function listAllPdfs(): PdfEntry[] {
  const result: PdfEntry[] = [];
  for (const { jurisdiction, id, pdfDir } of listPdfDirs()) {
    const pdfFile = findPdfFile(pdfDir);
    if (!pdfFile) continue;
    const meta = parsePdfMetadata(pdfDir);
    if (!meta) continue;
    result.push({
      id,
      jurisdiction: jurisdiction.toUpperCase(),
      title: meta.title,
      code: meta.code,
      canonicalUrl: meta.canonicalUrl,
      fieldCount: countSchemaFields(pdfDir),
      pdfPath: join(pdfDir, pdfFile),
      pdfDir,
    });
  }
  return result;
}

export function findPdfById(
  id: string | undefined,
): { pdfDir: string; pdfPath: string } | null {
  if (!id || id.includes("..")) return null;
  const match = listPdfDirs().find((entry) => entry.id === id);
  if (!match) return null;
  const pdfFile = findPdfFile(match.pdfDir);
  return pdfFile
    ? { pdfDir: match.pdfDir, pdfPath: join(match.pdfDir, pdfFile) }
    : null;
}
