import type { Loader } from "astro/loaders";
import type { PDFDefinition } from "#constants/pdf";
import { parseContentPath } from "./parseContentPath";

export type PdfModules = Record<string, { default: PDFDefinition }>;

/** Stores each PDF under its path: `pdfs/ma/cjp25/index.ts` is `ma/cjp25`. */
export function pdfLoader({ modules }: { modules: PdfModules }): Loader {
  return {
    name: "pdfs-loader",
    load: async ({ store, parseData, generateDigest }) => {
      store.clear();

      for (const [path, module] of Object.entries(modules)) {
        const id = path.match(/pdfs\/(.+)\/index\.ts$/)?.[1] ?? path;
        const definition = module.default;
        const data = await parseData({
          id,
          data: {
            title: definition.title,
            code: definition.code,
            jurisdiction: parseContentPath(id, "pdfs", definition),
            canonicalUrl: definition.canonicalUrl,
          },
        });
        store.set({ id, data, digest: generateDigest(data) });
      }
    },
  };
}
