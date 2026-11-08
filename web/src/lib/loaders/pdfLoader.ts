import { AstroError } from "astro/errors";
import type { Loader } from "astro/loaders";
import { JURISDICTIONS } from "#constants/jurisdictions";
import type { PDFDefinition } from "#constants/pdf";

export type PdfModules = Record<string, { default: PDFDefinition }>;

/**
 * Derives a PDF's id and jurisdiction from its definition path, which ends in
 * `{jurisdiction}/{id}/index.ts`.
 *
 * - `federal/ds11-application-for-us-passport/index.ts` → no jurisdiction
 * - `ma/military-affidavit/index.ts` → `"ma"`
 *
 * Throws if the folder is not `federal` or a known jurisdiction.
 */
export function parsePdfPath(
  path: string,
  jurisdictions: readonly string[] = Object.keys(JURISDICTIONS),
): { id: string; jurisdiction: string | undefined } {
  const [folder, id] = path.split("/").slice(-3);
  if (folder === "federal") return { id, jurisdiction: undefined };

  if (!jurisdictions.includes(folder)) {
    throw new AstroError(
      `PDF "${path}" is in an unknown jurisdiction folder "${folder}".`,
      `Use "federal" or one of: ${jurisdictions.join(", ")}.`,
    );
  }
  return { id, jurisdiction: folder };
}

export function pdfLoader({ modules }: { modules: PdfModules }): Loader {
  return {
    name: "pdf-loader",
    load: async ({ store, parseData, generateDigest }) => {
      store.clear();

      for (const [path, module] of Object.entries(modules)) {
        const definition = module.default;
        if ("jurisdiction" in definition) {
          throw new AstroError(
            `PDF "${path}" sets \`jurisdiction\` in its definition.`,
            "Remove it; the jurisdiction is derived from the PDF's folder.",
          );
        }

        const { id, jurisdiction } = parsePdfPath(path);
        const data = await parseData({
          id,
          data: {
            title: definition.title,
            code: definition.code,
            jurisdiction,
            canonicalUrl: definition.canonicalUrl,
          },
        });
        store.set({ id, data, digest: generateDigest(data) });
      }
    },
  };
}
