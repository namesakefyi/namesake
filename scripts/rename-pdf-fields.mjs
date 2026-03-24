#!/usr/bin/env node

/**
 * Renames form fields in a PDF (in place).
 * Usage: pnpm pdf:rename-fields path/to/form.pdf "oldName1" "newName1" "oldName2" "newName2" ...
 *   Pairs of oldName, newName. Odd number of args after path = error.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 3 || argv.length % 2 === 0) {
    console.error(
      'Usage: pnpm pdf:rename-fields path/to/form.pdf "old1" "new1" "old2" "new2" ...',
    );
    process.exit(1);
  }

  const [pathArg, ...pairs] = argv;
  const renames = [];
  for (let i = 0; i < pairs.length; i += 2) {
    renames.push({ oldName: pairs[i], newName: pairs[i + 1] });
  }

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
  let renamed = 0;
  let skipped = 0;

  for (const { oldName, newName } of renames) {
    try {
      const field = form.getField(oldName);
      // Move to root so the fully qualified name becomes just the new name
      form.acroForm.removeField(field.acroField);
      field.acroField.setParent(undefined);
      field.acroField.setPartialName(newName);
      form.acroForm.addField(field.acroField.ref);
      console.log(`Renamed: ${oldName} -> ${newName}`);
      renamed++;
    } catch (err) {
      console.warn(`Skipped (not found or error): ${oldName} -`, err.message);
      skipped++;
    }
  }

  const resultBytes = await pdfDoc.save();
  writeFileSync(pdfPath, resultBytes);
  console.log(`\nDone. Renamed ${renamed} field(s), skipped ${skipped}.`);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
