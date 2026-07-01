#!/usr/bin/env tsx

import { appendFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PDF } from "@libpdf/core";
import { diffWords } from "diff";
import pc from "picocolors";
import { listAllPdfs, type PdfEntry } from "../lib/catalog";
import { monitorConfig } from "../pdf-monitor.config";

const USER_AGENT =
  "namesake-pdf-monitor/1.0 (+https://github.com/namesakefyi/namesake)";

const PASS = pc.green("✓");
const FAIL = pc.red("✗");
const SKIP = pc.yellow("⊘");

export type DriftStatus = "unchanged" | "unknown" | "changed" | "error";

type FetchResultMap = {
  unchanged: Record<never, never>;
  unknown: { reason: string };
  changed: { remoteText: string; localText: string };
  error: { reason: string };
};

export type FetchResult = {
  [K in DriftStatus]: { status: K } & FetchResultMap[K];
}[DriftStatus];

export type CheckResult = { pdf: PdfEntry; result: FetchResult };

export const byStatus =
  (status: DriftStatus) =>
  ({ result }: CheckResult) =>
    result.status === status;

async function extractPdfText(
  bytes: Uint8Array,
  excludePages?: Set<number>,
): Promise<string> {
  const pdf = await PDF.load(bytes);
  return pdf
    .extractText()
    .filter((p) => !excludePages?.has(p.pageIndex + 1)) // pageIndex is 0-based; config uses 1-based
    .map((p) => p.text)
    .join("\n");
}

async function fetchPdfEntry(
  url: string,
  pdfPath: string,
  excludePages?: Set<number>,
): Promise<FetchResult> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(30_000),
    });

    if (res.status === 403)
      return { status: "unknown", reason: "HTTP 403 (blocked)" };
    if (!res.ok) return { status: "error", reason: `HTTP ${res.status}` };

    const buf = await res.arrayBuffer();
    const remoteText = await extractPdfText(new Uint8Array(buf), excludePages);
    const localText = await extractPdfText(readFileSync(pdfPath), excludePages);

    if (localText === remoteText) return { status: "unchanged" };
    return { status: "changed", remoteText, localText };
  } catch (err) {
    return {
      status: "error",
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

async function runChecks(
  pdfs: PdfEntry[],
): Promise<Array<{ pdf: PdfEntry; result: FetchResult; ms: number }>> {
  return Promise.all(
    pdfs.map(async (pdf) => {
      const t = performance.now();
      const exclusions = monitorConfig[pdf.id]?.excludePages;
      const excludePages = exclusions
        ? new Set(exclusions.map((e) => e.page))
        : undefined;
      const result = await fetchPdfEntry(
        pdf.canonicalUrl,
        pdf.pdfPath,
        excludePages,
      );
      return { pdf, result, ms: Math.round(performance.now() - t) };
    }),
  );
}

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

const ICONS: Record<DriftStatus, string> = {
  unchanged: PASS,
  unknown: SKIP,
  changed: FAIL,
  error: FAIL,
};

const STATUS_LABEL: Record<DriftStatus, (s: string) => string> = {
  unchanged: pc.green,
  unknown: pc.yellow,
  changed: (s) => pc.bold(pc.red(s)),
  error: (s) => pc.bold(pc.red(s)),
};

export function formatDiff(local: string, remote: string): string {
  const changes = diffWords(local, remote);
  if (changes.every((c) => !c.added && !c.removed)) return "";
  return `  ${changes.map((c) => (c.added ? pc.green(c.value) : c.removed ? pc.red(c.value) : pc.dim(c.value))).join("")}`;
}

function formatPdfId(pdf: PdfEntry): string {
  return `${pdf.jurisdiction.toLowerCase()} › ${pdf.id}`;
}

function formatResult(result: FetchResult, pdf: PdfEntry, dur: string): string {
  const icon = ICONS[result.status];
  const label = STATUS_LABEL[result.status](result.status);
  const id = formatPdfId(pdf);
  const main = `${icon} ${label} ${id} ${dur}`;
  if (result.status === "error") return `${main}\n  ${pc.red(result.reason)}`;
  if (result.status === "unknown")
    return `${main}\n  ${pc.yellow(result.reason)}`;
  if (result.status === "changed") {
    const diff = formatDiff(result.localText, result.remoteText);
    return diff ? `${main}\n${diff}` : main;
  }
  return main;
}

function printResult(pdf: PdfEntry, result: FetchResult, ms: number): void {
  const dur = pc.dim(formatDuration(ms));
  process.stdout.write(`${formatResult(result, pdf, dur)}\n`);
}

function printSummary(results: CheckResult[], totalMs: number): void {
  const counts = results.reduce(
    (acc, { result }) => {
      acc[result.status]++;
      return acc;
    },
    { unchanged: 0, unknown: 0, changed: 0, error: 0 } as Record<
      DriftStatus,
      number
    >,
  );

  const stat = (n: number, text: string, color: (s: string) => string) =>
    n === 0 ? pc.gray(`0 ${text}`) : pc.bold(color(`${n} ${text}`));

  const LABEL_PAD = 11;
  const label = (s: string) => `${pc.gray(s.padStart(LABEL_PAD))}  `;
  const cont = " ".repeat(LABEL_PAD + 2);
  const stats = [
    stat(counts.unchanged, "unchanged", pc.green),
    stat(counts.unknown, "unknown", pc.yellow),
    stat(counts.changed, "changed", pc.red),
    stat(counts.error, "errors", pc.red),
  ];

  process.stdout.write(`\n${results.length} PDFs scanned.\n\n`);
  process.stdout.write(`${label("PDF Files")}${stats.join(`\n${cont}`)}\n`);
  process.stdout.write(`${label("Duration")}${formatDuration(totalMs)}\n`);
}

function writeCiMetadata(results: CheckResult[]): void {
  const { GITHUB_OUTPUT, GITHUB_STEP_SUMMARY } = process.env;
  const changed = results.filter((r) => r.result.status === "changed");
  const hasNewChanges = changed.length > 0;

  if (GITHUB_OUTPUT)
    appendFileSync(
      GITHUB_OUTPUT,
      `has_new_changes=${hasNewChanges}\nchanged_count=${changed.length}\n`,
    );

  if (GITHUB_STEP_SUMMARY && hasNewChanges) {
    const lines = changed
      .map(
        ({ pdf }) => `- **${pdf.title}** (\`${pdf.id}\`): ${pdf.canonicalUrl}`,
      )
      .join("\n");
    appendFileSync(
      GITHUB_STEP_SUMMARY,
      [
        "## Upstream PDF changes detected",
        "",
        "The following PDFs have changed at their canonical source URLs and may need to be updated:",
        "",
        lines,
        "",
        "Please review each PDF and update the local copy in `web/src/content/pdfs/` if the new version includes relevant changes.",
        "",
      ].join("\n"),
    );
  }
}

async function main() {
  // Write defaults early so a crash before writeCiMetadata() doesn't leave outputs unset
  const { GITHUB_OUTPUT } = process.env;
  if (GITHUB_OUTPUT)
    appendFileSync(GITHUB_OUTPUT, "has_new_changes=false\nchanged_count=0\n");

  const start = performance.now();
  const pdfs = listAllPdfs().filter((p) => p.canonicalUrl);
  const results: CheckResult[] = [];

  process.stdout.write(`Scanning ${pdfs.length} PDFs for changes...\n\n`);

  for (const { pdf, result, ms } of await runChecks(pdfs)) {
    results.push({ pdf, result });
    printResult(pdf, result, ms);
  }

  printSummary(results, Math.round(performance.now() - start));
  writeCiMetadata(results);

  if (results.some(byStatus("changed"))) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    process.stderr.write(`[error] ${(err as Error).message}\n`);
    process.exit(2);
  });
}
