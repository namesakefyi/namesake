import type { PDFId } from "../../constants/pdf";
import { getPdfDefinition } from "..";

/**
 * Load multiple PDFs.
 *
 * @param pdfs - Array of PDF configurations
 * @param pdfs[].pdfId - The ID of the PDF to load
 * @param pdfs[].include - Whether to include this PDF (defaults to `true`)
 * @returns Promise that resolves to an array of PDF definitions
 *
 * @example
 * ```typescript
 * const pdfs = await loadPdfs([
 *   { pdfId: "always-included-pdf" },
 *   { pdfId: "conditional-pdf", include: someCondition },
 * ]);
 * ```
 */
export async function loadPdfs(
  pdfs: Array<{ pdfId: PDFId; include?: boolean }>,
) {
  const pdfIds = pdfs
    .filter(({ include = true }) => include)
    .map(({ pdfId }) => pdfId);

  return await Promise.all(pdfIds.map((pdfId) => getPdfDefinition(pdfId)));
}
