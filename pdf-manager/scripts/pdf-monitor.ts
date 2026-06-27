#!/usr/bin/env tsx

import { createHash } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import pc from "picocolors";
import { listAllPdfs, type PdfEntry } from "../lib/catalog";

const USER_AGENT =
  "namesake-pdf-monitor/1.0 (+https://github.com/namesakefyi/namesake)";

const PASS = pc.green("✓");
const FAIL = pc.red("✗");
const SKIP = pc.yellow("⊘");

export type DriftStatus =
  | "unchanged"
  | "unverifiable"
  | "new"
  | "changed"
  | "error";

type FetchResultMap = {
  unchanged: Record<never, never>;
  unverifiable: { reason: string };
  new: { hash: string; etag?: string };
  changed: { hash: string; etag?: string };
  error: { reason: string };
};

export type FetchResult = {
  [K in DriftStatus]: { status: K } & FetchResultMap[K];
}[DriftStatus];

export interface PdfHistoryEntry {
  url: string;
  hash: string;
  etag?: string;
  lastDetectedChange: string;
}

export type PdfHistory = Record<string, PdfHistoryEntry>;

export type CheckResult = { pdf: PdfEntry; result: FetchResult };

export const byStatus =
  (status: DriftStatus) =>
  ({ result }: CheckResult) =>
    result.status === status;

async function fetchPdfEntry(
  url: string,
  stored?: PdfHistoryEntry,
): Promise<FetchResult> {
  try {
    const headers: Record<string, string> = { "User-Agent": USER_AGENT };
    if (stored?.etag) headers["If-None-Match"] = stored.etag;

    const res = await fetch(url, {
      redirect: "follow",
      headers,
      signal: AbortSignal.timeout(30_000),
    });

    if (res.status === 304) return { status: "unchanged" };
    if (res.status === 403)
      return { status: "unverifiable", reason: "HTTP 403 (blocked)" };
    if (!res.ok) return { status: "error", reason: `HTTP ${res.status}` };

    const buf = await res.arrayBuffer();
    const hash = `sha256:${createHash("sha256").update(Buffer.from(buf)).digest("hex")}`;
    const etag = res.headers.get("etag") ?? undefined;

    if (!stored?.hash) return { status: "new", hash, etag };
    if (hash === stored.hash) return { status: "unchanged" };
    return { status: "changed", hash, etag };
  } catch (err) {
    return {
      status: "error",
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

async function* runChecks(
  pdfs: PdfEntry[],
  stored: PdfHistory,
): AsyncGenerator<{ pdf: PdfEntry; result: FetchResult; ms: number }> {
  for (const pdf of pdfs) {
    const t = performance.now();
    const result = await fetchPdfEntry(pdf.canonicalUrl, stored[pdf.id]);
    yield { pdf, result, ms: Math.round(performance.now() - t) };
  }
}

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

const RESULT_STYLES: Record<DriftStatus, { icon: string; suffix?: string }> = {
  unchanged: { icon: PASS },
  unverifiable: { icon: SKIP, suffix: pc.yellow("unverifiable") },
  new: { icon: PASS, suffix: pc.green("new") },
  changed: { icon: FAIL, suffix: pc.bold(pc.yellow("changed")) },
  error: { icon: FAIL },
};

function formatResult(result: FetchResult, url: string, dur: string): string {
  const { icon, suffix } = RESULT_STYLES[result.status];
  const label = result.status === "error" ? pc.red(result.reason) : suffix;
  return label ? `${icon} ${url} ${label} ${dur}` : `${icon} ${url} ${dur}`;
}

function printResult(pdf: PdfEntry, result: FetchResult, ms: number): void {
  const dur = pc.dim(formatDuration(ms));
  process.stdout.write(`${formatResult(result, pdf.canonicalUrl, dur)}\n`);
}

function printSummary(results: CheckResult[], totalMs: number): void {
  const count = (s: DriftStatus) => results.filter(byStatus(s)).length;

  const newStr =
    count("new") === 0
      ? pc.gray("0 new")
      : pc.bold(pc.magenta(`${count("new")} new`));

  const unchangedStr =
    count("unchanged") === 0
      ? pc.gray("0 unchanged")
      : pc.bold(pc.green(`${count("unchanged")} unchanged`));

  const unverifiableStr =
    count("unverifiable") === 0
      ? pc.gray("0 unverifiable")
      : pc.bold(pc.yellow(`${count("unverifiable")} unverifiable`));

  const changedStr =
    count("changed") === 0
      ? pc.gray("0 changed")
      : pc.bold(pc.yellow(`${count("changed")} changed`));

  const errorsStr =
    count("error") === 0
      ? pc.gray("0 errors")
      : pc.bold(pc.red(`${count("error")} errors`));

  const LABEL_PAD = 11;
  const label = (s: string) => `${pc.gray(s.padStart(LABEL_PAD))}  `;
  const cont = " ".repeat(LABEL_PAD + 2);
  const stats = [newStr, unchangedStr, unverifiableStr, changedStr, errorsStr];

  process.stdout.write("\n");
  process.stdout.write(`${label("PDF Files")}${stats.join(`\n${cont}`)}\n`);
  process.stdout.write(`${label("Duration")}${formatDuration(totalMs)}\n`);
  process.stdout.write("\n");
}

function loadPdfHistory(path: string): PdfHistory {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

function savePdfHistory(path: string, store: PdfHistory): void {
  writeFileSync(path, `${JSON.stringify(store, null, 2)}\n`);
}

function applyFetchResults(
  results: CheckResult[],
  stored: PdfHistory,
): boolean {
  let anyUpdated = false;
  for (const { pdf, result } of results) {
    if (
      result.status === "error" ||
      result.status === "unchanged" ||
      result.status === "unverifiable"
    )
      continue;
    stored[pdf.id] = {
      url: pdf.canonicalUrl,
      hash: result.hash,
      ...(result.etag ? { etag: result.etag } : {}),
      lastDetectedChange: new Date().toISOString(),
    };
    anyUpdated = true;
  }
  return anyUpdated;
}

function writeCiOutputs(results: CheckResult[]): void {
  for (const { pdf, result } of results) {
    if (result.status === "unverifiable")
      process.stderr.write(
        `[skip] ${pdf.id} (${pdf.canonicalUrl}): ${result.reason}\n`,
      );
    if (result.status === "error")
      process.stderr.write(
        `[warn] ${pdf.id} (${pdf.canonicalUrl}): ${result.reason}\n`,
      );
  }

  const { GITHUB_OUTPUT, GITHUB_STEP_SUMMARY } = process.env;
  const changed = results.filter(byStatus("changed"));

  if (GITHUB_OUTPUT) {
    appendFileSync(GITHUB_OUTPUT, `has_changes=${changed.length > 0}\n`);
    appendFileSync(GITHUB_OUTPUT, `changed_count=${changed.length}\n`);
  }

  if (GITHUB_STEP_SUMMARY && changed.length > 0) {
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

async function main(historyPath: string) {
  const start = performance.now();
  const stored = loadPdfHistory(historyPath);
  const pdfs = listAllPdfs().filter((p) => p.canonicalUrl);
  const results: CheckResult[] = [];

  for await (const { pdf, result, ms } of runChecks(pdfs, stored)) {
    results.push({ pdf, result });
    if (process.stdout.isTTY) printResult(pdf, result, ms);
  }

  if (applyFetchResults(results, stored)) savePdfHistory(historyPath, stored);

  if (process.stdout.isTTY)
    printSummary(results, Math.round(performance.now() - start));
  else writeCiOutputs(results);

  if (results.some(byStatus("changed"))) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const HISTORY_PATH = process.argv[2];
  if (!HISTORY_PATH) {
    process.stderr.write("Usage: pdf-monitor <hash-store-path>\n");
    process.exit(2);
  }
  main(HISTORY_PATH).catch((err) => {
    process.stderr.write(`[error] ${(err as Error).message}\n`);
    process.exit(2);
  });
}
