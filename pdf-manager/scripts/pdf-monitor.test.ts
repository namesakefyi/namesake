import { describe, expect, it } from "vitest";
import type { PdfEntry } from "../lib/catalog";
import { byStatus, type CheckResult, type FetchResult } from "./pdf-monitor";

function makePdf(overrides: Partial<PdfEntry> = {}): PdfEntry {
  return {
    id: "test-form",
    jurisdiction: "federal",
    title: "Test Form",
    code: "TEST-1",
    canonicalUrl: "https://example.gov/test.pdf",
    fieldCount: 0,
    pdfPath: "/path/to/test.pdf",
    pdfDir: "/path/to",
    ...overrides,
  };
}

function makeResults(entries: Array<[PdfEntry, FetchResult]>): CheckResult[] {
  return entries.map(([pdf, result]) => ({ pdf, result }));
}

describe("CheckResult", () => {
  it("marks a new PDF as new, not changed", () => {
    const pdf = makePdf();
    const results = makeResults([[pdf, { status: "new", hash: "sha256:abc" }]]);
    expect(results.filter(byStatus("new"))).toHaveLength(1);
    expect(results.filter(byStatus("new"))[0].pdf.id).toBe(pdf.id);
    expect(results.filter(byStatus("changed"))).toHaveLength(0);
    expect(results.filter(byStatus("error"))).toHaveLength(0);
  });

  it("ignores an unchanged hash", () => {
    const pdf = makePdf();
    const results = makeResults([[pdf, { status: "unchanged" }]]);
    expect(results.filter(byStatus("changed"))).toHaveLength(0);
    expect(results.filter(byStatus("new"))).toHaveLength(0);
    expect(results.filter(byStatus("error"))).toHaveLength(0);
  });

  it("ignores a 304 Not Modified response", () => {
    const pdf = makePdf();
    const results = makeResults([[pdf, { status: "unchanged" }]]);
    expect(results.filter(byStatus("changed"))).toHaveLength(0);
    expect(results.filter(byStatus("new"))).toHaveLength(0);
    expect(results.filter(byStatus("error"))).toHaveLength(0);
  });

  it("marks a different hash as changed", () => {
    const pdf = makePdf();
    const results = makeResults([
      [pdf, { status: "changed", hash: "sha256:xyz" }],
    ]);
    expect(results.filter(byStatus("changed"))).toHaveLength(1);
    expect(results.filter(byStatus("changed"))[0].pdf.id).toBe(pdf.id);
    expect(results.filter(byStatus("new"))).toHaveLength(0);
    expect(results.filter(byStatus("error"))).toHaveLength(0);
  });

  it("records a network error and does not count as changed", () => {
    const pdf = makePdf();
    const results = makeResults([
      [pdf, { status: "error", reason: "fetch failed" }],
    ]);
    const errors = results.filter(byStatus("error"));
    expect(errors).toHaveLength(1);
    expect(errors[0].pdf.id).toBe(pdf.id);
    expect(errors[0].result.status === "error" && errors[0].result.reason).toBe(
      "fetch failed",
    );
    expect(results.filter(byStatus("changed"))).toHaveLength(0);
  });

  it("treats unverifiable as neither changed nor an error", () => {
    const pdf = makePdf();
    const results = makeResults([
      [pdf, { status: "unverifiable", reason: "HTTP 403 (blocked)" }],
    ]);
    expect(results.filter(byStatus("error"))).toHaveLength(0);
    expect(results.filter(byStatus("changed"))).toHaveLength(0);
    expect(results.filter(byStatus("new"))).toHaveLength(0);
  });

  it("separates changed from errors in a mixed result", () => {
    const pdf1 = makePdf({ id: "form-a", title: "Form A" });
    const pdf2 = makePdf({ id: "form-b", title: "Form B" });
    const results = makeResults([
      [pdf1, { status: "changed", hash: "sha256:new" }],
      [pdf2, { status: "error", reason: "HTTP 503" }],
    ]);
    expect(results.filter(byStatus("changed"))).toHaveLength(1);
    expect(results.filter(byStatus("changed"))[0].pdf.id).toBe("form-a");
    expect(results.filter(byStatus("error"))).toHaveLength(1);
    expect(results.filter(byStatus("error"))[0].pdf.id).toBe("form-b");
  });
});
