#!/usr/bin/env tsx

import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PDF } from "@libpdf/core";
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
  bytes: ArrayBuffer,
  excludePages?: Set<number>,
): Promise<string> {
  const pdf = await PDF.load(new Uint8Array(bytes));
  return pdf
    .extractText()
    .filter((p) => !excludePages?.has(p.pageIndex + 1)) // pageIndex is 0-based; config uses 1-based
    .map((p) => p.text)
    .join("\n");
}

function hashText(text: string): string {
  return `sha256:${createHash("sha256").update(text).digest("hex")}`;
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
    const remoteText = await extractPdfText(buf, excludePages);
    const localText = await extractPdfText(
      readFileSync(pdfPath).buffer,
      excludePages,
    );

    if (hashText(localText) === hashText(remoteText))
      return { status: "unchanged" };
    return { status: "changed", remoteText, localText };
  } catch (err) {
    return {
      status: "error",
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

async function* runChecks(
  pdfs: PdfEntry[],
): AsyncGenerator<{ pdf: PdfEntry; result: FetchResult; ms: number }> {
  for (const pdf of pdfs) {
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
    yield { pdf, result, ms: Math.round(performance.now() - t) };
  }
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

type DiffLine = { type: "add" | "remove" | "context"; text: string };

function computeLineDiff(local: string, remote: string): DiffLine[] {
  const a = local.split("\n").filter((l) => l.trim());
  const b = remote.split("\n").filter((l) => l.trim());
  const m = a.length;
  const n = b.length;

  // LCS table using Uint32Array for efficiency
  const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);

  // Backtrack to build diff operations
  const ops: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: "context", text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: "add", text: b[j - 1] });
      j--;
    } else {
      ops.unshift({ type: "remove", text: a[i - 1] });
      i--;
    }
  }
  return ops;
}

function formatDiff(local: string, remote: string): string {
  const CONTEXT = 2;
  const diff = computeLineDiff(local, remote);

  // Collect indices of changed lines and expand by context
  const visible = new Set<number>();
  for (let idx = 0; idx < diff.length; idx++) {
    if (diff[idx].type === "context") continue;
    for (
      let c = Math.max(0, idx - CONTEXT);
      c <= Math.min(diff.length - 1, idx + CONTEXT);
      c++
    )
      visible.add(c);
  }

  if (visible.size === 0) return "";

  const lines: string[] = [];
  let lastVisible = -1;
  for (let idx = 0; idx < diff.length; idx++) {
    if (!visible.has(idx)) continue;
    if (lastVisible >= 0 && idx > lastVisible + 1) lines.push(pc.dim("  …"));
    const line = diff[idx];
    if (line.type === "add") lines.push(pc.green(`  + ${line.text}`));
    else if (line.type === "remove") lines.push(pc.red(`  - ${line.text}`));
    else lines.push(pc.dim(`    ${line.text}`));
    lastVisible = idx;
  }
  return lines.join("\n");
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
  const count = (s: DriftStatus) => results.filter(byStatus(s)).length;

  const upToDateStr =
    count("unchanged") === 0
      ? pc.gray("0 unchanged")
      : pc.bold(pc.green(`${count("unchanged")} unchanged`));

  const unknownStr =
    count("unknown") === 0
      ? pc.gray("0 unknown")
      : pc.bold(pc.yellow(`${count("unknown")} unknown`));

  const changedStr =
    count("changed") === 0
      ? pc.gray("0 changed")
      : pc.bold(pc.red(`${count("changed")} changed`));

  const errorsStr =
    count("error") === 0
      ? pc.gray("0 errors")
      : pc.bold(pc.red(`${count("error")} errors`));

  const LABEL_PAD = 11;
  const label = (s: string) => `${pc.gray(s.padStart(LABEL_PAD))}  `;
  const cont = " ".repeat(LABEL_PAD + 2);
  const stats = [upToDateStr, unknownStr, changedStr, errorsStr];

  process.stdout.write(`\n${results.length} PDFs scanned.\n\n`);
  process.stdout.write(`${label("PDF Files")}${stats.join(`\n${cont}`)}\n`);
  process.stdout.write(`${label("Duration")}${formatDuration(totalMs)}\n`);
}

function writeCiMetadata(results: CheckResult[]): void {
  const { GITHUB_OUTPUT, GITHUB_STEP_SUMMARY } = process.env;
  const changed = results.filter((r) => r.result.status === "changed");
  const hasNewChanges = changed.length > 0;

  if (GITHUB_OUTPUT) {
    appendFileSync(GITHUB_OUTPUT, `has_new_changes=${hasNewChanges}\n`);
    appendFileSync(GITHUB_OUTPUT, `changed_count=${changed.length}\n`);
  }

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
  const start = performance.now();
  const pdfs = listAllPdfs().filter((p) => p.canonicalUrl);
  const results: CheckResult[] = [];

  process.stdout.write(`Scanning ${pdfs.length} PDFs for changes...\n\n`);

  for await (const { pdf, result, ms } of runChecks(pdfs)) {
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
