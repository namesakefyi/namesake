import type { FormData } from "#constants/fields";
import type { PDFDefinition } from "#constants/pdf";
import { buildPdfPacket } from "./buildPdfPacket";
import { downloadPdf } from "./downloadPdf";
import { fillPdf } from "./fillPdf";

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
  const pdfBytes = await Promise.all(
    pdfs.map((pdf) => fillPdf({ pdf, userData })),
  );

  const packetBytes = await buildPdfPacket({
    title,
    instructions,
    pdfs,
    pdfBytes,
  });

  await downloadPdf({ pdfBytes: packetBytes, title });
}
