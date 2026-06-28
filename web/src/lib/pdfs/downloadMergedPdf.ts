import type { FormData } from "#constants/fields";
import type { PDFDefinition } from "#constants/pdf";
import { createCoverPage } from "./createCoverPage";
import { downloadPdf } from "./downloadPdf";
import { fillPdf } from "./fillPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Download a merged PDF with a cover page and multiple filled PDFs.
 */
export async function downloadMergedPdf({
  title,
  instructions,
  pdfs,
  userData,
}: {
  title: string;
  instructions: string[];
  pdfs: PDFDefinition[];
  userData: Partial<FormData>;
}) {
  const { PDF } = await loadPdfLib();

  const [coverPageBytes, ...filledPdfBytes] = await Promise.all([
    createCoverPage({
      title,
      instructions,
      documents: pdfs.map((pdf) => ({ title: pdf.title, code: pdf.code })),
    }),
    ...pdfs.map((pdf) => fillPdf({ pdf, userData })),
  ]);

  const mergedPdf = await PDF.merge([coverPageBytes, ...filledPdfBytes]);
  const mergedPdfBytes = await mergedPdf.save();
  downloadPdf({ pdfBytes: mergedPdfBytes, title });
}
