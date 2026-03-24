#!/usr/bin/env node

/**
 * Removes specified form fields from a PDF (in place).
 * Usage: pnpm pdf:remove-fields path/to/form.pdf "field.name[0]" "other.field[1]" ...
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";

/** Removes widgets from a field before removal (workaround for some field types). */
function removeFieldSafely(form, fieldName) {
  const field = form.getField(fieldName);
  const widgets = field.acroField.getWidgets();
  for (let i = widgets.length - 1; i >= 0; i--) {
    field.acroField.removeWidget(i);
  }
  form.removeField(field);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 2) {
    console.error(
      'Usage: pnpm pdf:remove-fields path/to/form.pdf "field1" "field2" ...',
    );
    process.exit(1);
  }

  const [pathArg, ...fieldNames] = argv;
  const baseDir = process.env.INIT_CWD || process.cwd();
  const pdfPath = resolve(baseDir, pathArg);

  let pdfDoc;
  try {
    const bytes = readFileSync(pdfPath);
    pdfDoc = await PDFDocument.load(bytes);
  } catch (err) {
    console.error(`Failed to load PDF: ${err.message}`);
    process.exit(1);
  }

  const form = pdfDoc.getForm();
  let removed = 0;
  let skipped = 0;

  for (const name of fieldNames) {
    try {
      removeFieldSafely(form, name);
      console.log("Removed:", name);
      removed++;
    } catch (err) {
      console.warn("Skipped (not found or error):", name, "-", err.message);
      skipped++;
    }
  }

  const resultBytes = await pdfDoc.save();
  writeFileSync(pdfPath, resultBytes);
  console.log(`\nDone. Removed ${removed} field(s), skipped ${skipped}.`);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
