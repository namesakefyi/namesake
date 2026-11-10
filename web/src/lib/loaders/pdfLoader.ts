import type { Loader } from "astro/loaders";
import type { PDFDefinition } from "#constants/pdf";
import { parseContentPath, rejectJurisdictionKey } from "./parseContentPath";

export type PdfModules = Record<string, { default: PDFDefinition }>;

/**
 * Stores each PDF definition under its folder name. `base` is the prefix of
 * every module path, so `{base}ma/cjp25/index.ts` is `cjp25` in `ma`.
 */
export function pdfLoader({
  base,
  modules,
}: {
  base: string;
  modules: PdfModules;
}): Loader {
  return {
    name: "pdfs-loader",
    load: async ({ store, parseData, generateDigest }) => {
      store.clear();

      for (const [path, module] of Object.entries(modules)) {
        const entryPath = path.slice(base.length).replace(/\/index\.ts$/, "");
        const definition = module.default;
        rejectJurisdictionKey(definition, entryPath, "pdfs");

        const id = entryPath.split("/").at(-1) as string;
        const data = await parseData({
          id,
          data: {
            title: definition.title,
            code: definition.code,
            jurisdiction: parseContentPath(entryPath, "pdfs"),
            canonicalUrl: definition.canonicalUrl,
          },
        });
        store.set({ id, data, digest: generateDigest(data) });
      }
    },
  };
}
