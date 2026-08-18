import type { PDFDefinition } from "#constants/pdf";
import { buildPdfPacket } from "./buildPdfPacket";
import { downloadPdf } from "./downloadPdf";
import { fetchPdf } from "./fetchPdf";

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
  const pdfBytes = await Promise.all(
    pdfs.map((pdf) =>
      fetchPdf(pdf.pdfPath).then((bytes) => new Uint8Array(bytes)),
    ),
  );

  const packetBytes = await buildPdfPacket({
    title,
    instructions,
    pdfs,
    pdfBytes,
  });

  await downloadPdf({ pdfBytes: packetBytes, title });
}
