import type { FormData } from "../../constants/fields";
import type { PDFDefinition } from "../../constants/pdf";
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
  const { PDFDocument } = await loadPdfLib();
  const mergedPdf = await PDFDocument.create();

  // Create and add cover page
  const coverPageBytes = await createCoverPage({
    title,
    instructions,
    documents: pdfs.map((pdf) => ({
      title: pdf.title,
      code: pdf.code,
    })),
  });
  const coverPageDoc = await PDFDocument.load(coverPageBytes);
  const [coverPage] = await mergedPdf.copyPages(coverPageDoc, [0]);
  mergedPdf.addPage(coverPage);

  // Add the rest of the PDFs
  for (const pdf of pdfs) {
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices(),
    );
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  const mergedPdfBytes = await mergedPdf.save();
  downloadPdf({ pdfBytes: mergedPdfBytes, title });
}
