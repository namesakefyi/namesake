#!/usr/bin/env node

/**
 * Nudges all form field widgets on specified pages up by a given number of
 * points (in PDF user-space coordinates). Edits the PDF in place.
 *
 * Usage:
 *   pnpm pdf:nudge-fields path/to/form.pdf --pages 2,3 --by 5
 *
 * Options:
 *   --pages  Comma-separated 1-based page numbers to adjust (default: all)
 *   --by     Points to move upward — positive = up, negative = down (default: 5)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";

function parseArgs(argv) {
  const args = { path: null, pages: null, by: 5 };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--pages") {
      args.pages = argv[++i]
        .split(",")
        .map((p) => Number.parseInt(p.trim(), 10) - 1); // convert to 0-based
    } else if (argv[i] === "--by") {
      args.by = Number.parseFloat(argv[++i]);
    } else if (!args.path) {
      args.path = argv[i];
    }
  }

  return args;
}

async function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);

  if (!args.path) {
    console.error(
      "Usage: pnpm pdf:nudge-fields path/to/form.pdf --pages 2,3 --by 5",
    );
    process.exit(1);
  }

  const baseDir = process.env.INIT_CWD || process.cwd();
  const pdfPath = resolve(baseDir, args.path);

  let pdfDoc;
  try {
    const bytes = readFileSync(pdfPath);
    pdfDoc = await PDFDocument.load(bytes);
  } catch (err) {
    console.error(`Failed to load PDF: ${err.message}`);
    process.exit(1);
  }

  const pages = pdfDoc.getPages();
  const targetPageIndices = args.pages ?? pages.map((_, i) => i); // default: all pages

  const invalidPages = targetPageIndices.filter(
    (i) => i < 0 || i >= pages.length,
  );
  if (invalidPages.length > 0) {
    console.error(
      `Invalid page number(s): ${invalidPages.map((i) => i + 1).join(", ")} (PDF has ${pages.length} page(s))`,
    );
    process.exit(1);
  }

  // Build a Set of page refs for fast lookup
  const targetPageRefs = new Set(targetPageIndices.map((i) => pages[i].ref));

  const form = pdfDoc.getForm();
  const fields = form.getFields();
  let nudged = 0;

  for (const field of fields) {
    for (const widget of field.acroField.getWidgets()) {
      const pageRef = widget.P();
      if (!pageRef || !targetPageRefs.has(pageRef)) continue;

      const rect = widget.getRectangle();
      widget.setRectangle({
        x: rect.x,
        y: rect.y + args.by,
        width: rect.width,
        height: rect.height,
      });
      nudged++;
    }
  }

  const resultBytes = await pdfDoc.save();
  writeFileSync(pdfPath, resultBytes);

  const pageLabels = targetPageIndices.map((i) => i + 1).join(", ");
  console.log(
    `Done. Nudged ${nudged} widget(s) on page(s) ${pageLabels} by ${args.by > 0 ? "+" : ""}${args.by} pts.`,
  );
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
