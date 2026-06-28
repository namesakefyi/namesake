#!/usr/bin/env tsx

/**
 * Extracts AcroForm field names from PDFs and writes schema.ts files.
 * Usage: pnpm extract-schema [path/to/file.pdf] [--quiet]
 *   No arg: all PDFs in web/src/content/pdfs. With arg: single PDF. --quiet: no output.
 */

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { intro, log, taskLog } from "@clack/prompts";
import { findPdfFiles, processPdf } from "../lib/schema";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = join(__dirname, "..", "..");
const PDFS_DIR = join(MONOREPO_ROOT, "web/src/content/pdfs");

async function main() {
  const argv = process.argv.slice(2);
  const quiet = argv.includes("--quiet");
  const arg = argv.find((a) => a !== "--quiet");

  if (!quiet) intro("PDF Schema Extraction");

  let pdfPaths: string[];
  if (arg) {
    const baseDir = process.env.INIT_CWD || process.cwd();
    const resolved = resolve(baseDir, arg);
    if (!resolved.endsWith(".pdf")) {
      if (!quiet) log.error("Path must be a .pdf file");
      process.exit(1);
    }
    pdfPaths = [resolved];
  } else {
    pdfPaths = findPdfFiles(PDFS_DIR);
  }

  if (pdfPaths.length === 0) {
    if (!quiet) log.warn("No PDF files found in web/src/content/pdfs");
    return;
  }

  const task = quiet
    ? null
    : taskLog({ title: "Extracting schema", retainLog: true });
  const schemaPaths = [];

  for (const pdfPath of pdfPaths) {
    try {
      const result = await processPdf(pdfPath);
      schemaPaths.push(result.path);
      if (!quiet) {
        task?.message(
          `${result.displayPath}\n→ extracted ${result.fieldNames.length} fields`,
        );
      }
    } catch (err) {
      if (!quiet) task?.error(err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  if (!quiet) task?.message("Formatting with Biome...");
  const result = spawnSync(
    "pnpm",
    ["exec", "biome", "format", "--write", ...schemaPaths],
    { cwd: MONOREPO_ROOT, stdio: quiet ? "pipe" : "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);

  if (!quiet) task?.success(`Extracted schema for ${pdfPaths.length} PDFs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
