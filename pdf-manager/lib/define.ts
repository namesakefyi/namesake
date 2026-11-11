import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { jurisdictionDir, PDFS_DIR } from "./catalog.ts";
import { buildFillEntries } from "./fields.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

/** Returns a kebab-case PDF id from code and title. */
export function generatePdfId(code: string, title: string): string {
  const codePart = (code || "").replace(/[\s-]/g, "").toLowerCase();
  const titlePart = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!titlePart) return codePart || "form";
  return codePart ? `${codePart}-${titlePart}` : titlePart;
}

interface DefinitionParams {
  title: string;
  code: string;
  canonicalUrl: string;
  pdfFile: string;
}

/** Returns index.ts definition content as a string. */
function generateDefinition({
  title,
  code,
  canonicalUrl,
  pdfFile,
}: DefinitionParams): string {
  const props = [
    `title: ${JSON.stringify(title)},`,
    ...(code ? [`code: ${JSON.stringify(code)},`] : []),
    `canonicalUrl: ${JSON.stringify(canonicalUrl)},`,
    "file,",
    "fields: pdfSchema,",
  ];
  return `import { definePdf } from "#lib/pdfs/definePdf";
import file from "./${pdfFile}";
import { pdfSchema } from "./schema";

export default definePdf({
${props.map((prop) => `  ${prop}`).join("\n")}
});
`;
}

/**
 * A starter \`{ pdf, fill }\` entry to paste into the \`pdfs\` of a form's
 * \`download.ts\`. Every PDF field is listed so the mapping is complete.
 */
export function generateFillSnippet({
  id,
  pdfDir,
  fieldNames,
}: {
  id: string;
  pdfDir: string;
  fieldNames: readonly string[];
}): string {
  const name = id
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("")
    .replace(/^(\d)/, "pdf$1");
  const importPath = `#content/pdfs/${relative(PDFS_DIR, pdfDir)}`;
  return `import ${name} from "${importPath}";

{
  pdf: ${name},
  fill: (data) => ({
${buildFillEntries(fieldNames).join("\n")}
  }),
},
`;
}

/** Runs biome format --write on the given file paths. */
export function formatFiles(paths: string[]): void {
  if (paths.length === 0) return;
  spawnSync("pnpm", ["exec", "biome", "format", "--write", ...paths], {
    cwd: ROOT,
    stdio: "pipe",
  });
}

export interface OutputPaths {
  id: string;
  pdfDir: string;
  pdfDestPath: string;
  indexPath: string;
}

/** Computes output paths from normalized metadata. */
export function computeOutputPaths({
  title,
  code,
  jurisdiction,
}: {
  title: string;
  code: string;
  jurisdiction: string;
}): OutputPaths {
  const id = generatePdfId(code, title);
  const pdfDir = join(jurisdictionDir(jurisdiction), id);
  return {
    id,
    pdfDir,
    pdfDestPath: join(pdfDir, `${id}.pdf`),
    indexPath: join(pdfDir, "index.ts"),
  };
}

export interface WriteDefinitionFilesParams {
  title: string;
  code: string;
  canonicalUrl: string;
  pdfDir: string;
  pdfDestPath: string;
  indexPath: string;
  pdfBytes: Uint8Array | Buffer;
}

export function writeDefinitionFiles({
  title,
  code,
  canonicalUrl,
  pdfDir,
  pdfDestPath,
  indexPath,
  pdfBytes,
}: WriteDefinitionFilesParams): void {
  mkdirSync(pdfDir, { recursive: true });
  writeFileSync(pdfDestPath, pdfBytes);
  const pdfFile = basename(pdfDestPath);
  writeFileSync(
    indexPath,
    generateDefinition({ title, code, canonicalUrl, pdfFile }),
  );
  formatFiles([indexPath]);
}
