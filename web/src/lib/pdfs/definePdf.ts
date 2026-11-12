import type { PdfDefinition, PdfSchema } from "#constants/pdf";

/**
 * Describe a PDF in the library.
 *
 * @example
 * ```ts
 * definePdf<Fields>({
 *   title: "Change of Name",
 *   code: "PC-8.1",
 *   canonicalUrl: "https://…",
 *   file,
 * })
 * ```
 */
export function definePdf<S extends PdfSchema>(
  pdf: Omit<PdfDefinition<S>, "fields">,
): PdfDefinition<S> {
  return pdf;
}
