import type { LoaderContext } from "astro/loaders";
import { describe, expect, it, vi } from "vitest";
import type { PDFDefinition } from "#constants/pdf";
import { type PdfModules, pdfLoader } from "../pdfLoader";

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
  await pdfLoader({ base: "./content/pdfs/", modules }).load(context);
  return store;
}

describe("pdfLoader", () => {
  it("stores each PDF under its folder name with the jurisdiction from its path", async () => {
    const store = await loadModules({
      "./content/pdfs/ny/ucsnc1/index.ts": definition(),
      "./content/pdfs/ds11/index.ts": definition(),
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

  it("rejects PDFs in an unknown jurisdiction folder", async () => {
    await expect(
      loadModules({ "./content/pdfs/federal/ds11/index.ts": definition() }),
    ).rejects.toThrow(/unknown jurisdiction folder "federal"/);
  });

  it("rejects definitions that set jurisdiction", async () => {
    await expect(
      loadModules({
        "./content/pdfs/ma/cjp25/index.ts": definition({ jurisdiction: "ri" }),
      }),
    ).rejects.toThrow("sets `jurisdiction`");
  });
});
