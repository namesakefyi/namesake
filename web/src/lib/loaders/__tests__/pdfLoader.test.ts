import type { LoaderContext } from "astro/loaders";
import { describe, expect, it, vi } from "vitest";
import type { PDFDefinition } from "#constants/pdf";
import { type PdfModules, parsePdfPath, pdfLoader } from "../pdfLoader";

function definition(overrides: Record<string, unknown> = {}) {
  return {
    default: {
      title: "Test Form",
      code: "TF1",
      canonicalUrl: "https://example.com",
      ...overrides,
    } as unknown as PDFDefinition,
  };
}

async function loadModules(modules: PdfModules) {
  const store = { clear: () => {}, set: vi.fn() };
  const context = {
    store,
    parseData: vi.fn(async ({ data }) => data),
    generateDigest: () => "",
  } as unknown as LoaderContext;
  await pdfLoader({ modules }).load(context);
  return store;
}

describe("parsePdfPath", () => {
  const jurisdictions = ["ma", "ri"];

  it("returns no jurisdiction for federal PDFs", () => {
    expect(
      parsePdfPath("./content/pdfs/federal/ds11/index.ts", jurisdictions),
    ).toEqual({ id: "ds11", jurisdiction: undefined });
  });

  it("returns the folder name for PDFs in a jurisdiction folder", () => {
    expect(
      parsePdfPath("./content/pdfs/ma/cjp25/index.ts", jurisdictions),
    ).toEqual({ id: "cjp25", jurisdiction: "ma" });
  });

  it("throws for unknown jurisdiction folders", () => {
    expect(() =>
      parsePdfPath("./content/pdfs/zz/cjp25/index.ts", jurisdictions),
    ).toThrow(/unknown jurisdiction folder "zz"/);
  });
});

describe("pdfLoader", () => {
  it("stores each PDF with the jurisdiction from its folder", async () => {
    const store = await loadModules({
      "./content/pdfs/ny/ucsnc1/index.ts": definition(),
      "./content/pdfs/federal/ds11/index.ts": definition(),
    });

    expect(store.set).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "ucsnc1",
        data: expect.objectContaining({ jurisdiction: "ny" }),
      }),
    );
    expect(store.set).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "ds11",
        data: expect.objectContaining({ jurisdiction: undefined }),
      }),
    );
  });

  it("rejects definitions that set jurisdiction", async () => {
    await expect(
      loadModules({
        "./content/pdfs/ma/cjp25/index.ts": definition({ jurisdiction: "ri" }),
      }),
    ).rejects.toThrow("sets `jurisdiction` in its definition");
  });
});
