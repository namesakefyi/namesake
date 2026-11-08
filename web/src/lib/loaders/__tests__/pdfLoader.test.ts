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
  const store = { clear: vi.fn(), set: vi.fn() };
  const context = {
    store,
    parseData: vi.fn(async ({ data }) => data),
    generateDigest: vi.fn(() => "digest"),
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
      "./content/pdfs/federal/ds11/index.ts": definition({ code: "DS-11" }),
    });

    expect(store.clear).toHaveBeenCalledOnce();
    expect(store.set).toHaveBeenCalledWith({
      id: "ucsnc1",
      data: {
        title: "Test Form",
        code: "TF1",
        jurisdiction: "ny",
        canonicalUrl: "https://example.com",
      },
      digest: "digest",
    });
    expect(store.set).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "ds11",
        data: expect.objectContaining({
          code: "DS-11",
          jurisdiction: undefined,
        }),
      }),
    );
  });

  it("does not pass through other definition fields", async () => {
    const store = await loadModules({
      "./content/pdfs/ma/cjp25/index.ts": definition({ pdfPath: "x.pdf" }),
    });

    expect(store.set.mock.calls[0][0].data).not.toHaveProperty("pdfPath");
  });

  it("rejects PDFs in unknown folders", async () => {
    await expect(
      loadModules({
        "./content/pdfs/getting-started/x/index.ts": definition(),
      }),
    ).rejects.toThrow('PDF "./content/pdfs/getting-started/x/index.ts"');
  });

  it("rejects definitions that set jurisdiction", async () => {
    await expect(
      loadModules({
        "./content/pdfs/ma/cjp25/index.ts": definition({ jurisdiction: "ri" }),
      }),
    ).rejects.toThrow("sets `jurisdiction` in its definition");
  });
});
