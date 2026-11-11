import type { PDFDefinition, PdfSchema } from "#constants/pdf";

/**
 * Describe a PDF in the library.
 *
 * @example
 * ```ts
 * definePdf<typeof pdfSchema>({
 *   title: "Change of Name",
 *   code: "PC-8.1",
 *   canonicalUrl: "https://…",
 *   file,
 * })
 * ```
 */
export function definePdf<S extends PdfSchema>(
  pdf: Omit<PDFDefinition<S>, "fields">,
): PDFDefinition<S> {
  return pdf;
}
