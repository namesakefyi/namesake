import { describe, expect, it } from "vitest";
import type { PdfEntry } from "../lib/catalog";
import { computeDrift, type FetchResult } from "./check-pdf-drift";

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

function makeResults(
  entries: Array<[string, FetchResult]>,
): Map<string, FetchResult> {
  return new Map(entries);
}

describe("computeDrift", () => {
  it("marks a new PDF as newlyIndexed, not changed", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "new", hash: "sha256:abc" }]]),
    );
    expect(result.newlyIndexed).toHaveLength(1);
    expect(result.newlyIndexed[0].id).toBe(pdf.id);
    expect(result.changed).toHaveLength(0);
    expect(result.fetchErrors).toHaveLength(0);
  });

  it("ignores an unchanged hash (same)", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "unchanged" }]]),
    );
    expect(result.changed).toHaveLength(0);
    expect(result.newlyIndexed).toHaveLength(0);
    expect(result.fetchErrors).toHaveLength(0);
  });

  it("ignores a 304 Not Modified response (unchanged)", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "unchanged" }]]),
    );
    expect(result.changed).toHaveLength(0);
    expect(result.newlyIndexed).toHaveLength(0);
    expect(result.fetchErrors).toHaveLength(0);
  });

  it("marks a different hash as changed", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "changed", hash: "sha256:xyz" }]]),
    );
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].id).toBe(pdf.id);
    expect(result.newlyIndexed).toHaveLength(0);
    expect(result.fetchErrors).toHaveLength(0);
  });

  it("records a network error in fetchErrors and does not count as changed", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "error", reason: "fetch failed" }]]),
    );
    expect(result.fetchErrors).toHaveLength(1);
    expect(result.fetchErrors[0].id).toBe(pdf.id);
    expect(result.fetchErrors[0].reason).toBe("fetch failed");
    expect(result.changed).toHaveLength(0);
  });

  it("treats unverifiable as neither changed nor an error", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([
        [pdf.id, { status: "unverifiable", reason: "HTTP 403 (blocked)" }],
      ]),
    );
    expect(result.fetchErrors).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
    expect(result.newlyIndexed).toHaveLength(0);
  });

  it("records an HTTP error in fetchErrors", () => {
    const pdf = makePdf();
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "error", reason: "HTTP 404" }]]),
    );
    expect(result.fetchErrors).toHaveLength(1);
    expect(result.changed).toHaveLength(0);
  });

  it("separates changed from errors in a mixed result", () => {
    const pdf1 = makePdf({ id: "form-a", title: "Form A" });
    const pdf2 = makePdf({ id: "form-b", title: "Form B" });
    const result = computeDrift(
      [pdf1, pdf2],
      makeResults([
        [pdf1.id, { status: "changed", hash: "sha256:new" }],
        [pdf2.id, { status: "error", reason: "HTTP 503" }],
      ]),
    );
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].id).toBe("form-a");
    expect(result.fetchErrors).toHaveLength(1);
    expect(result.fetchErrors[0].id).toBe("form-b");
  });

  it("skips PDFs with an empty canonicalUrl", () => {
    const pdf = makePdf({ canonicalUrl: "" });
    const result = computeDrift(
      [pdf],
      makeResults([[pdf.id, { status: "changed", hash: "sha256:x" }]]),
    );
    expect(result.changed).toHaveLength(0);
    expect(result.newlyIndexed).toHaveLength(0);
  });

  it("skips PDFs with no fetch result", () => {
    const pdf = makePdf();
    const result = computeDrift([pdf], makeResults([]));
    expect(result.changed).toHaveLength(0);
    expect(result.fetchErrors).toHaveLength(0);
  });
});
