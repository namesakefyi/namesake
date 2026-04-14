import type { PDFDefinition } from "../../constants/pdf";

/**
 * Define a PDF form.
 *
 * @example
 * ```ts
 * definePdf<PdfFieldName>({
 *   id: "cjp25-petition-to-change-name-of-minor",
 *   title: "Petition to Change Name of Minor",
 *   jurisdiction: "MA",
 *   pdfPath: pdf,
 *   resolver: {
 *     division: (data) => data.residenceCounty,
 *     petitionerName: (data) => joinNames(...),
 *   },
 * })
 * ```
 */
export function definePdf<TPdfFieldName extends string = string>(
  pdf: PDFDefinition<TPdfFieldName>,
): PDFDefinition<TPdfFieldName> {
  return pdf;
}
