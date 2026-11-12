import type { FormPdf } from "#constants/forms";
import type { FormData } from "#lib/forms/questions";
import { buildPdfPacket } from "./buildPdfPacket";
import { downloadPdf } from "./downloadPdf";
import { fetchPdf } from "./fetchPdf";
import { fillPdf } from "./fillPdf";

/**
 * Downloads a cover page and the given PDFs as one file, filled with `data`
 * or blank when there's none.
 */
export async function downloadPdfPacket({
  title,
  instructions,
  pdfs,
  data,
}: {
  title: string;
  instructions: string[];
  pdfs: readonly FormPdf[];
  data?: FormData;
}) {
  const documents = await Promise.all(
    pdfs.map(async ({ pdf, fill }) => ({
      pdf,
      bytes: data
        ? await fillPdf(pdf, fill(data))
        : new Uint8Array(await fetchPdf(pdf.file)),
    })),
  );

  const packetBytes = await buildPdfPacket({ title, instructions, documents });
  await downloadPdf({ pdfBytes: packetBytes, title });
}
