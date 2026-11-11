import type { PDFDefinition, PdfSchema } from "#constants/pdf";

/**
 * Describe a PDF in the library. Its jurisdiction comes from its folder.
 *
 * @example
 * ```ts
 * definePdf({
 *   title: "Change of Name",
 *   code: "PC-8.1",
 *   canonicalUrl: "https://…",
 *   file,
 *   fields: pdfSchema,
 * })
 * ```
 */
export function definePdf<const S extends PdfSchema>(
  pdf: PDFDefinition<S>,
): PDFDefinition<S> {
  return pdf;
}
