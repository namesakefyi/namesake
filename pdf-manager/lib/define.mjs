import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { escapeKey } from "../../scripts/utils.mjs";
import { buildTestDataEntries, loadFormFields } from "./fields.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PDF_TS_PATH = join(ROOT, "src/constants/pdf.ts");

/** Returns a kebab-case PDF id from code and title. */
export function generatePdfId(code, title) {
  const codePart = (code || "").replace(/[\s-]/g, "").toLowerCase();
  const titlePart = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!titlePart) return codePart || "form";
  return codePart ? `${codePart}-${titlePart}` : titlePart;
}

/** Returns index.ts definition content as a string. */
export function generateDefinition({
  id,
  title,
  code,
  jurisdiction,
  pdfFields,
}) {
  const props = [
    `id: "${id}",`,
    `title: "${title}",`,
    ...(code ? [`code: "${code}",`] : []),
    ...(jurisdiction && jurisdiction !== "federal"
      ? [`jurisdiction: "${jurisdiction}",`]
      : []),
    "pdfPath: pdf,",
  ];
  const fieldLines = pdfFields.map((f) => `  ${escapeKey(f.name)}: undefined,`);
  return `import { definePdf } from "../../utils/definePdf";
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

/** Returns index.test.ts starter content as a string. */
export function generateStarterTest({ id, title, pdfFields }) {
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
import type { FormData } from "../../../constants/fields";
import { expectPdfFieldsMatch } from "../../utils/expectPdfFieldsMatch";
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
export function addIdToPdfConstants(id) {
  let content = readFileSync(PDF_TS_PATH, "utf8");
  if (content.includes(`"${id}"`)) return false;
  content = content.replace(/(\] as const;)/, `  "${id}",\n$1`);
  writeFileSync(PDF_TS_PATH, content);
  return true;
}

/** Runs biome format --write on the given file paths. */
export function formatFiles(paths) {
  if (paths.length === 0) return;
  spawnSync("pnpm", ["exec", "biome", "format", "--write", ...paths], {
    cwd: ROOT,
    stdio: "pipe",
  });
}

/** Computes output paths from normalized metadata. */
export function computeOutputPaths({ title, code, jurisdiction }) {
  const id = generatePdfId(code, title);
  const jurisdictionDir =
    jurisdiction === "federal"
      ? join(ROOT, "src/pdfs/federal")
      : join(ROOT, "src/pdfs", jurisdiction.toLowerCase());
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

/** Creates the PDF directory and writes all generated files. Returns the id. */
export function writeDefinitionFiles({
  id,
  title,
  code,
  jurisdiction,
  pdfDir,
  pdfDestPath,
  indexPath,
  testPath,
  pdfFields,
  pdfBytes,
}) {
  mkdirSync(pdfDir, { recursive: true });
  writeFileSync(pdfDestPath, pdfBytes);

  const definition = generateDefinition({
    id,
    title,
    code,
    jurisdiction,
    pdfFields,
  });
  writeFileSync(indexPath, `${definition}\n`);

  if (!existsSync(testPath)) {
    const test = generateStarterTest({ id, title, pdfFields });
    writeFileSync(testPath, `${test}\n`);
  }

  addIdToPdfConstants(id);
  formatFiles([indexPath, ...(existsSync(testPath) ? [testPath] : [])]);
}
