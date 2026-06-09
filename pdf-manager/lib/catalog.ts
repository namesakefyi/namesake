import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
export const PDFS_DIR = join(ROOT, "src/pdfs");

interface PdfMeta {
  title: string;
  code: string;
  jurisdiction: string;
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
    jurisdiction: content.match(/\bjurisdiction:\s*"([^"]+)"/)?.[1] ?? "",
    canonicalUrl: content.match(/\bcanonicalUrl:\s*"([^"]+)"/)?.[1] ?? "",
  };
}

/** Counts fields in schema.ts by counting PDF class references. */
function countSchemaFields(pdfDir: string): number {
  const schemaPath = join(pdfDir, "schema.ts");
  if (!existsSync(schemaPath)) return 0;
  const content = readFileSync(schemaPath, "utf8");
  return (
    content.match(/:\s*PDF(?:TextField|CheckBox|RadioGroup|Dropdown)/g) ?? []
  ).length;
}

export function listAllPdfs(): PdfEntry[] {
  const result: PdfEntry[] = [];
  for (const entry of readdirSync(PDFS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "utils") continue;
    const jurisdictionDir = join(PDFS_DIR, entry.name);
    for (const pdfEntry of readdirSync(jurisdictionDir, {
      withFileTypes: true,
    })) {
      if (!pdfEntry.isDirectory()) continue;
      const pdfDir = join(jurisdictionDir, pdfEntry.name);
      const pdfFile = readdirSync(pdfDir).find((f) => f.endsWith(".pdf"));
      if (!pdfFile) continue;
      const meta = parsePdfMetadata(pdfDir);
      if (!meta) continue;
      result.push({
        id: pdfEntry.name,
        jurisdiction: meta.jurisdiction || entry.name.toUpperCase(),
        title: meta.title,
        code: meta.code,
        canonicalUrl: meta.canonicalUrl,
        fieldCount: countSchemaFields(pdfDir),
        pdfPath: join(pdfDir, pdfFile),
        pdfDir,
      });
    }
  }
  return result;
}

export function findPdfById(
  id: string | undefined,
): { pdfDir: string; pdfPath: string } | null {
  if (!id || id.includes("..")) return null;
  for (const entry of readdirSync(PDFS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "utils") continue;
    const pdfDir = join(PDFS_DIR, entry.name, id);
    if (!existsSync(pdfDir)) continue;
    const pdfFile = readdirSync(pdfDir).find((f) => f.endsWith(".pdf"));
    if (pdfFile) return { pdfDir, pdfPath: join(pdfDir, pdfFile) };
  }
  return null;
}
