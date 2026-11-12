import type { PdfDefinition } from "#constants/pdf";
import { buildCoverPage } from "./buildCoverPage";
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
  documents: readonly { pdf: PdfDefinition; bytes: Uint8Array }[];
}): Promise<Uint8Array> {
  const { PDF } = await loadPdfLib();

  const coverPageBytes = await buildCoverPage({
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
