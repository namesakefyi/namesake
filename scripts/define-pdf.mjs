#!/usr/bin/env node
// Usage: pnpm pdf:define path/to/form.pdf
// Generates a PDF definition (index.ts, schema.ts) with placeholders for all form fields.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import {
  autocomplete,
  box,
  cancel,
  group,
  intro,
  isCancel,
  log,
  outro,
  text,
} from "@clack/prompts";
import { stripFormFieldStyles } from "./clean-pdf.mjs";
import { escapeKey } from "./utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT = join(__dirname, "..");
const FIELDS_PATH = join(ROOT, "src/constants/fields.ts");
const JURISDICTIONS_PATH = join(ROOT, "src/constants/jurisdictions.ts");
const PDF_TS_PATH = join(ROOT, "src/constants/pdf.ts");

/** Common PDF field name -> form field name mappings. */
const PDF_TO_FORM_FIELD_MAP = {
  petitionerFirstName: "oldFirstName",
  petitionerMiddleName: "oldMiddleName",
  petitionerLastName: "oldLastName",
  county: "residenceCounty",
};

const DEFINITION_EXISTS_MSG =
  "Definition already exists. Use a different form or remove the existing file first.";

const onCancel = () => exitWith("Operation canceled.", 0);

/** Exits the process after showing a cancel message. */
function exitWith(message, code = 1) {
  cancel(message);
  process.exit(code);
}

/** Returns an error message if title is empty; otherwise undefined. */
function validateTitle(value) {
  if (!value?.trim()) return "Title is required";
  return undefined;
}

/** Returns a kebab-case PDF id from code and title. */
function generatePdfId(code, title) {
  const codePart = (code || "").replace(/[\s-]/g, "").toLowerCase();
  const titlePart = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!titlePart) return codePart || "form";
  return codePart ? `${codePart}-${titlePart}` : titlePart;
}

/** Returns jurisdictions from jurisdictions.ts as { name, abbreviation }[]. */
function loadJurisdictions() {
  const content = readFileSync(JURISDICTIONS_PATH, "utf8");
  const jurisdictions = [];
  const regex = /\{\s*name:\s*"([^"]+)",\s*abbreviation:\s*"([^"]+)"/g;
  for (const m of content.matchAll(regex)) {
    jurisdictions.push({ name: m[1], abbreviation: m[2] });
  }
  return jurisdictions;
}

/** Returns { name, type }[] for each form field in the PDF. */
function extractPdfFields(pdfDoc) {
  let form;
  try {
    form = pdfDoc.getForm();
  } catch {
    return [];
  }
  const result = [];
  for (const field of form.getFields()) {
    const name = field.getName();
    const ctor = field.constructor.name;
    let type;
    if (ctor === "PDFTextField") type = "text";
    else if (ctor === "PDFCheckBox") type = "checkbox";
    else if (ctor === "PDFRadioGroup") type = "radio";
    else if (ctor === "PDFDropdown" || ctor === "PDFOptionList")
      type = "dropdown";
    else type = "other";
    result.push({ name, type });
  }
  return result;
}

/** Returns { name, type }[] parsed from FIELD_DEFS in fields.ts. */
function loadFormFields() {
  const content = readFileSync(FIELDS_PATH, "utf8");
  const regex =
    /\{\s*name:\s*"([^"]+)"[^}]*type:\s*"(string|boolean|string\[\])"/g;
  const result = [];
  for (const m of content.matchAll(regex)) {
    result.push({ name: m[1], type: m[2] });
  }
  return result;
}

/** Maps a PDF field name to a form field name, or null if no match. */
function pdfFieldToFormField(pdfFieldName, formFieldsByName) {
  if (formFieldsByName.has(pdfFieldName)) return pdfFieldName;
  if (PDF_TO_FORM_FIELD_MAP[pdfFieldName])
    return PDF_TO_FORM_FIELD_MAP[pdfFieldName];
  const base = pdfFieldName.replace(/(True|False)$/, "");
  if (formFieldsByName.has(base)) return base;
  return null;
}

/** Returns a placeholder value for a form field by type and name. */
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

/** Builds testData entries from PDF fields. Returns array of "key: value" or comment lines. */
function buildTestDataEntries(pdfFields, formFields) {
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

/** Returns the output directory path for a jurisdiction (required). */
function getOutputDir(jurisdiction) {
  if (!jurisdiction?.trim()) {
    throw new Error("Jurisdiction is required");
  }
  if (jurisdiction === "federal") {
    return join(ROOT, "src/pdfs/federal");
  }
  return join(ROOT, "src/pdfs", jurisdiction.toLowerCase());
}

/** Returns { id, outDir, pdfDir, pdfDestPath, outPath } from metadata. */
function computeOutputPaths(metadata) {
  const id = generatePdfId(metadata.code, metadata.title);
  const outDir = getOutputDir(metadata.jurisdiction);
  const pdfDir = join(outDir, id);
  return {
    id,
    outDir,
    pdfDir,
    pdfDestPath: join(pdfDir, `${id}.pdf`),
    outPath: join(pdfDir, "index.ts"),
  };
}

/** Returns metadata with trimmed title/code and jurisdiction. */
function normalizeMetadata(metadata) {
  return {
    title: metadata.title.trim(),
    code: (metadata.code || "").trim(),
    jurisdiction: metadata.jurisdiction?.trim() ?? "",
  };
}

/** Returns the index.ts definition file content as a string. */
function generateDefinition({ id, title, code, jurisdiction, pdfFields }) {
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

/** Returns Clack autocomplete options for jurisdictions. */
function buildJurisdictionOptions(jurisdictions) {
  return [
    { value: "federal", label: "Federal" },
    ...jurisdictions.map((j) => ({
      value: j.abbreviation,
      label: `${j.name} (${j.abbreviation})`,
    })),
  ];
}

/** Returns an error message if jurisdiction is empty; otherwise undefined. */
function validateJurisdiction(value) {
  if (!value?.trim()) return "Jurisdiction is required";
  return undefined;
}

/** Prompts for metadata. Returns { title, code, jurisdiction }. */
async function promptMetadata(jurisdictionOptions) {
  const metadata = await group(
    {
      title: () =>
        text({
          message: "Form title",
          placeholder: "Petition to Change Name of Adult",
          validate: validateTitle,
        }),
      code: () =>
        text({
          message: "Form code (optional)",
          placeholder: "CJP-27",
        }),
      jurisdiction: () =>
        autocomplete({
          message: "Jurisdiction",
          options: jurisdictionOptions,
          placeholder: "Type to search...",
          maxItems: 10,
          validate: validateJurisdiction,
        }),
    },
    { onCancel },
  );

  if (isCancel(metadata)) exitWith("Operation canceled.", 0);
  return metadata;
}

/** Writes the PDF with stripped form field styles to the given path. */
async function writeStrippedPdf(pdfDoc, pdfDestPath) {
  stripFormFieldStyles(pdfDoc);
  const strippedBytes = await pdfDoc.save();
  writeFileSync(pdfDestPath, strippedBytes);
}

/** Formats the given file paths with Biome. */
function formatFiles(paths) {
  if (paths.length === 0) return;
  spawnSync("pnpm", ["exec", "biome", "format", "--write", ...paths], {
    cwd: ROOT,
    stdio: "pipe",
  });
}

/** Appends id to PDF_IDS in pdf.ts. Returns false if already present. */
function addIdToPdfConstants(id) {
  let content = readFileSync(PDF_TS_PATH, "utf8");
  if (content.includes(`"${id}"`)) return false;
  content = content.replace(/(\] as const;)/, `  "${id}",\n$1`);
  writeFileSync(PDF_TS_PATH, content);
  return true;
}

/** Returns camelCase import name from kebab-case id. */
function idToImportName(id) {
  return id
    .split("-")
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
}

/** Escape a string for safe inclusion in a double-quoted JavaScript string literal. */
function escapeForJsDoubleQuotedString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Returns starter test file content as a string. */
function generateStarterTest({ id, title, pdfFields }) {
  const importName = idToImportName(id);
  const escapedTitle = escapeForJsDoubleQuotedString(title);
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

/** Writes the starter test file to the given path. */
function writeStarterTest({ testPath, id, title, pdfFields }) {
  const testDir = dirname(testPath);
  if (!existsSync(testDir)) mkdirSync(testDir, { recursive: true });
  const content = generateStarterTest({ id, title, pdfFields });
  writeFileSync(testPath, `${content}\n`);
}

/** Runs all generation steps and logs progress. */
async function runGenerationSteps({
  pdfDoc,
  pdfDestPath,
  outPath,
  output,
  id,
  title,
  pdfDir,
  pdfFields,
}) {
  const testPath = join(pdfDir, "index.test.ts");
  const needsStarterTest = !existsSync(testPath);

  try {
    await writeStrippedPdf(pdfDoc, pdfDestPath);
  } catch (err) {
    throw new Error(`Failed to write PDF: ${err.message}`);
  }
  log.message("Saved PDF!");

  if (readFileSync(PDF_TS_PATH, "utf8").includes(`"${id}"`)) {
    log.message("Already in PDF_IDS");
  } else {
    addIdToPdfConstants(id);
    log.message("Added to PDF_IDS!");
  }

  runSchemaExtraction(pdfDestPath);
  log.message("Generated schema!");

  writeFileSync(outPath, `${output}\n`);
  log.message("Generated definition!");

  if (needsStarterTest) {
    writeStarterTest({ testPath, id, title, pdfFields });
    log.message("Generated test file!");
  }

  const toFormat = [outPath];
  if (existsSync(testPath)) toFormat.push(testPath);
  formatFiles(toFormat);
  log.message("Formatted new files!");
}

/** Spawns extract-pdf-schema.mjs. Throws on failure. */
function runSchemaExtraction(pdfPath) {
  const scriptPath = join(__dirname, "extract-pdf-schema.mjs");
  const args = pdfPath
    ? [scriptPath, pdfPath, "--quiet"]
    : [scriptPath, "--quiet"];
  const result = spawnSync("node", args, {
    cwd: ROOT,
    stdio: "pipe",
  });
  if (result.status !== 0) {
    exitWith("Schema extraction failed.", result.status ?? 1);
  }
}

/** Main entry: validates input, prompts for metadata, generates files. */
async function main() {
  intro("Let's define a Namesake PDF! ♥︎");

  const pdfPathArg = process.argv[2];
  if (!pdfPathArg?.trim()) {
    exitWith(
      "A path to the PDF file is required.\n\nUsage: pnpm pdf:define path/to/form.pdf",
    );
  }

  const baseDir = process.env.INIT_CWD || process.cwd();
  const resolvedPath = resolve(baseDir, pdfPathArg.trim());
  if (!existsSync(resolvedPath)) exitWith(`File not found: ${resolvedPath}`);
  if (!resolvedPath.toLowerCase().endsWith(".pdf"))
    exitWith("File must be a .pdf");

  log.message(
    "Before beginning: create, rename, and/or reposition form fields in the PDF. Follow instructions in the README:\n\nhttps://github.com/namesakefyi/namesake/blob/main/src/pdfs/README.md",
  );

  const jurisdictions = loadJurisdictions();
  const jurisdictionOptions = buildJurisdictionOptions(jurisdictions);

  const metadata = await promptMetadata(jurisdictionOptions);
  const normalized = normalizeMetadata(metadata);
  const { id, outDir, pdfDir, pdfDestPath, outPath } =
    computeOutputPaths(normalized);

  if (existsSync(outPath)) {
    exitWith(`${outPath} — ${DEFINITION_EXISTS_MSG}`);
  }

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(readFileSync(resolvedPath));
  } catch (err) {
    exitWith(err.code === "ENOENT" ? "File not found." : err.message);
  }

  const pdfFields = extractPdfFields(pdfDoc);
  if (pdfFields.length === 0) exitWith("No form fields found in this PDF.");

  const unsupported = pdfFields.filter(
    (f) => f.type === "dropdown" || f.type === "other",
  );
  if (unsupported.length > 0) {
    log.warn(
      `${unsupported.length} field(s) are dropdown/other — fillPdf only supports text and checkbox. Map to string for dropdown; you may need custom fill logic.`,
    );
  }
  log.success(
    `Found ${pdfFields.length} form ${pdfFields.length === 1 ? "field" : "fields"}`,
  );

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  if (!existsSync(pdfDir)) mkdirSync(pdfDir, { recursive: true });

  const output = generateDefinition({
    id,
    ...normalized,
    pdfFields,
  });

  await runGenerationSteps({
    pdfDoc,
    pdfDestPath,
    outPath,
    output,
    id,
    title: normalized.title,
    pdfDir,
    pdfFields,
  });

  const dirPath = relative(ROOT, pdfDir);
  log.success(dirPath);

  outro("All done!");

  box(
    `1. Map fields to form data in the resolver
2. Write tests to validate all field mappings and conditional logic
3. Open a pull request!`,
    "Next steps",
    {
      contentAlign: "left",
      titleAlign: "left",
      width: "auto",
      rounded: true,
      withGuide: false,
    },
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
