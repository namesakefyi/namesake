import type { FormPdf } from "#constants/pdf";
import type { Data } from "#lib/forms/questions";
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
  pdfs: readonly FormPdf[];
  userData: Data;
}) {
  const pdfBytes = await Promise.all(
    pdfs.map(({ pdf, fill }) => fillPdf(pdf, fill(userData))),
  );

  const packetBytes = await buildPdfPacket({
    title,
    instructions,
    pdfs: pdfs.map(({ pdf }) => pdf),
    pdfBytes,
  });

  await downloadPdf({ pdfBytes: packetBytes, title });
}
