import type { FormData } from "#constants/fields";
import type { PDFDefinition } from "#constants/pdf";
import { fillPdf } from "./fillPdf";
import { mergePdfsWithCoverPage } from "./mergePdfsWithCoverPage";

/**
 * Download a merged PDF with a cover page and multiple filled PDFs.
 */
export async function downloadFilledPdf({
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
  await mergePdfsWithCoverPage({
    title,
    instructions,
    pdfs,
    getPdfBytes: (pdf) => fillPdf({ pdf, userData }),
  });
}
