import type { PDFDefinition } from "#constants/pdf";
import { fetchPdf } from "./fetchPdf";
import { mergePdfsWithCoverPage } from "./mergePdfsWithCoverPage";

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
  await mergePdfsWithCoverPage({
    title,
    instructions,
    pdfs,
    getPdfBytes: (pdf) =>
      fetchPdf(pdf.pdfPath).then((bytes) => new Uint8Array(bytes)),
  });
}
