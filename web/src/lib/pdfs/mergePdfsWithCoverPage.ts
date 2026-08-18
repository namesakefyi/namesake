import type { PDFDefinition } from "#constants/pdf";
import { createCoverPage } from "./createCoverPage";
import { downloadPdf } from "./downloadPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Merge a cover page with per-PDF bytes produced by `getPdfBytes` and
 * download the result. Shared by the filled and blank download flows, which
 * differ only in how each PDF's bytes are produced.
 */
export async function mergePdfsWithCoverPage({
  title,
  instructions,
  pdfs,
  getPdfBytes,
}: {
  title: string;
  instructions: string[];
  pdfs: PDFDefinition[];
  getPdfBytes: (pdf: PDFDefinition) => Promise<Uint8Array>;
}) {
  const { PDF } = await loadPdfLib();

  const [coverPageBytes, ...pdfBytes] = await Promise.all([
    createCoverPage({
      title,
      instructions,
      documents: pdfs.map((pdf) => ({ title: pdf.title, code: pdf.code })),
    }),
    ...pdfs.map((pdf) => getPdfBytes(pdf)),
  ]);

  const mergedPdf = await PDF.merge([coverPageBytes, ...pdfBytes]);
  const mergedPdfBytes = await mergedPdf.save();
  downloadPdf({ pdfBytes: mergedPdfBytes, title });
}
