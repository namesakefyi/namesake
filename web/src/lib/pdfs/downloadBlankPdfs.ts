import type { PDFDefinition } from "#constants/pdf";
import { createCoverPage } from "./createCoverPage";
import { downloadPdf } from "./downloadPdf";
import { fetchPdf } from "./fetchPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Download a merged PDF with a cover page and multiple blank (unfilled) PDFs.
 */
export async function downloadBlankPdfs({
  title,
  instructions,
  pdfs,
}: {
  title: string;
  instructions: string[];
  pdfs: PDFDefinition[];
}) {
  const { PDF } = await loadPdfLib();

  const [coverPageBytes, ...blankPdfBytes] = await Promise.all([
    createCoverPage({
      title,
      instructions,
      documents: pdfs.map((pdf) => ({ title: pdf.title, code: pdf.code })),
    }),
    ...pdfs.map((pdf) =>
      fetchPdf(pdf.pdfPath).then((bytes) => new Uint8Array(bytes)),
    ),
  ]);

  const mergedPdf = await PDF.merge([coverPageBytes, ...blankPdfBytes]);
  const mergedPdfBytes = await mergedPdf.save();
  downloadPdf({ pdfBytes: mergedPdfBytes, title });
}
