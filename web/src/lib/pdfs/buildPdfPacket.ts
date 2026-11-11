import type { PDFDefinition } from "#constants/pdf";
import { createCoverPage } from "./createCoverPage";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Build a merged PDF packet: a cover page followed by each document.
 */
export async function buildPdfPacket({
  title,
  instructions,
  documents,
}: {
  title: string;
  instructions: string[];
  documents: readonly { pdf: PDFDefinition; bytes: Uint8Array }[];
}): Promise<Uint8Array> {
  const { PDF } = await loadPdfLib();

  const coverPageBytes = await createCoverPage({
    title,
    instructions,
    documents: documents.map(({ pdf }) => ({
      title: pdf.title,
      code: pdf.code,
    })),
  });

  const mergedPdf = await PDF.merge([
    coverPageBytes,
    ...documents.map(({ bytes }) => bytes),
  ]);
  return await mergedPdf.save();
}
