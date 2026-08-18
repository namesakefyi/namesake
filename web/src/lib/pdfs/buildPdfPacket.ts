import type { PDFDefinition } from "#constants/pdf";
import { createCoverPage } from "./createCoverPage";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Build a merged PDF packet: a cover page followed by each PDF's
 * already-resolved bytes. `pdfBytes[i]` must correspond to `pdfs[i]`.
 */
export async function buildPdfPacket({
  title,
  instructions,
  pdfs,
  pdfBytes,
}: {
  title: string;
  instructions: string[];
  pdfs: PDFDefinition[];
  pdfBytes: Uint8Array[];
}): Promise<Uint8Array> {
  const { PDF } = await loadPdfLib();

  const coverPageBytes = await createCoverPage({
    title,
    instructions,
    documents: pdfs.map((pdf) => ({ title: pdf.title, code: pdf.code })),
  });

  const mergedPdf = await PDF.merge([coverPageBytes, ...pdfBytes]);
  return await mergedPdf.save();
}
