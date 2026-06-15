import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { escapeKey } from "../../scripts/utils.mjs";
import { buildTestDataEntries, loadFormFields } from "./fields.ts";
import type { PdfFieldInfo } from "./pdf.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PDF_TS_PATH = join(ROOT, "src/constants/pdf.ts");

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
  id: string;
  title: string;
  code: string;
  jurisdiction: string;
  canonicalUrl: string;
  pdfFields: PdfFieldInfo[];
}

/** Returns index.ts definition content as a string. */
function generateDefinition({
  id,
  title,
  code,
  jurisdiction,
  canonicalUrl,
  pdfFields,
}: DefinitionParams): string {
  const props = [
    `id: "${id}",`,
    `title: "${title}",`,
    ...(code ? [`code: "${code}",`] : []),
    ...(jurisdiction && jurisdiction !== "federal"
      ? [`jurisdiction: "${jurisdiction}",`]
      : []),
    `canonicalUrl: "${canonicalUrl}",`,
    "pdfPath: pdf,",
  ];
  const fieldLines = pdfFields.map((f) => `  ${escapeKey(f.name)}: undefined,`);
  return `import { definePdf } from "#pdfs/definePdf";
import pdf from "./${id}.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
${props.join("\n")}
  resolver: (data) => ({
    // TODO: Map fields to form data
${fieldLines.join("\n")}
  }),
});
`;
}

interface StarterTestParams {
  id: string;
  title: string;
  pdfFields: PdfFieldInfo[];
}

/** Returns index.test.ts starter content as a string. */
function generateStarterTest({
  id,
  title,
  pdfFields,
}: StarterTestParams): string {
  const importName = id
    .split("-")
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
  const escapedTitle = String(title)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
  const formFields = loadFormFields();
  const testDataLines = buildTestDataEntries(pdfFields, formFields);
  const testDataBody =
    testDataLines.length > 0
      ? testDataLines.join("\n")
      : "    // TODO: Add form data for resolver";

  return `import { describe, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#pdfs/expectPdfFieldsMatch";
import ${importName} from ".";

describe("${escapedTitle}", () => {
  const testData: Partial<FormData> = {
${testDataBody}
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(${importName}, testData);
  });

  // Test any derived fields below
});
`;
}

/** Appends id to PDF_IDS in src/constants/pdf.ts. Returns false if already present. */
function addIdToPdfConstants(id: string): boolean {
  let content = readFileSync(PDF_TS_PATH, "utf8");
  if (content.includes(`"${id}"`)) return false;
  content = content.replace(/(\] as const;)/, `  "${id}",\n$1`);
  writeFileSync(PDF_TS_PATH, content);
  return true;
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
  jurisdictionDir: string;
  pdfDir: string;
  pdfDestPath: string;
  indexPath: string;
  testPath: string;
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
  const jurisdictionDir =
    jurisdiction.toLowerCase() === "federal"
      ? join(ROOT, "src/content/pdfs/federal")
      : join(ROOT, "src/content/pdfs", jurisdiction.toLowerCase());
  const pdfDir = join(jurisdictionDir, id);
  return {
    id,
    jurisdictionDir,
    pdfDir,
    pdfDestPath: join(pdfDir, `${id}.pdf`),
    indexPath: join(pdfDir, "index.ts"),
    testPath: join(pdfDir, "index.test.ts"),
  };
}

export interface WriteDefinitionFilesParams {
  id: string;
  title: string;
  code: string;
  jurisdiction: string;
  canonicalUrl: string;
  pdfDir: string;
  pdfDestPath: string;
  indexPath: string;
  testPath: string;
  pdfFields: PdfFieldInfo[];
  pdfBytes: Uint8Array | Buffer;
}

/** Creates the PDF directory and writes all generated files. Returns the id. */
export function writeDefinitionFiles({
  id,
  title,
  code,
  jurisdiction,
  canonicalUrl,
  pdfDir,
  pdfDestPath,
  indexPath,
  testPath,
  pdfFields,
  pdfBytes,
}: WriteDefinitionFilesParams): void {
  mkdirSync(pdfDir, { recursive: true });
  writeFileSync(pdfDestPath, pdfBytes);

  const definition = generateDefinition({
    id,
    title,
    code,
    jurisdiction,
    canonicalUrl,
    pdfFields,
  });
  writeFileSync(indexPath, `${definition}\n`);

  const testIsNew = !existsSync(testPath);
  if (testIsNew) {
    const test = generateStarterTest({ id, title, pdfFields });
    writeFileSync(testPath, `${test}\n`);
  }

  addIdToPdfConstants(id);
  formatFiles(testIsNew ? [indexPath, testPath] : [indexPath]);
}
