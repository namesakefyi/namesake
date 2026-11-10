import type { LoaderContext } from "astro/loaders";
import { expect, it, vi } from "vitest";
import type { PDFDefinition } from "#constants/pdf";
import { pdfLoader } from "../pdfLoader";

it("stores each PDF under its folder name with the jurisdiction from its path", async () => {
  const definition = {
    default: { title: "Test", canonicalUrl: "https://example.com" },
  } as unknown as { default: PDFDefinition };
  const store = { clear: () => {}, set: vi.fn() };
  await pdfLoader({
    modules: {
      "./content/pdfs/ny/ucsnc1/index.ts": definition,
      "./content/pdfs/ds11/index.ts": definition,
    },
  }).load({
    store,
    parseData: async ({ data }: { data: object }) => data,
    generateDigest: () => "",
  } as unknown as LoaderContext);

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
