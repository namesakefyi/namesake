import type { FormPdf } from "#constants/forms";
import type { FormData } from "#lib/forms/questions";
import { buildPdfPacket } from "./buildPdfPacket";
import { fetchPdf } from "./fetchPdf";
import { fillPdf } from "./fillPdf";

const REVOKE_DELAY_MS = 40_000;

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
  savePdf(packetBytes, title);
}

function savePdf(bytes: Uint8Array, title: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.pdf`;
  link.click();
  // Some browsers read the file after `click` returns, so wait before
  // freeing it.
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}
