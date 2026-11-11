import type { Loader } from "astro/loaders";
import type { FormConfig, FormPdfSummary } from "#constants/forms";
import { parseContentPath } from "./parseContentPath";

export type FormModules = Record<string, { default: FormConfig }>;

/**
 * Stores each form's metadata under its path, `forms/ma/court-order/index.ts`
 * as `ma/court-order`, with the step count and PDFs pages show before the
 * form itself loads.
 */
export function formLoader({ modules }: { modules: FormModules }): Loader {
  return {
    name: "forms-loader",
    load: async ({ store, parseData, generateDigest }) => {
      store.clear();

      for (const [path, module] of Object.entries(modules)) {
        const id = path.match(/forms\/(.+)\/index\.ts$/)?.[1] ?? path;
        const {
          title,
          description,
          category,
          unlisted,
          costs,
          steps,
          download,
        } = module.default;
        const pdfs: FormPdfSummary[] = download.pdfs.map(({ pdf, when }) => ({
          title: pdf.title,
          code: pdf.code,
          conditional: !!when,
          file: pdf.file,
        }));
        const data = await parseData({
          id,
          data: {
            title,
            description,
            jurisdiction: parseContentPath(id, "forms", module.default),
            category,
            unlisted,
            costs,
            stepCount: steps.length,
            pdfs,
          },
        });
        store.set({ id, data, digest: generateDigest(data) });
      }
    },
  };
}
