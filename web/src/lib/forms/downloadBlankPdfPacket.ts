import { type FormConfig, resolveInstructions } from "#constants/forms";

/**
 * Downloads every PDF for a form, unfilled, with a cover page. PDF
 * lib and utilities are loaded on demand when the user clicks download.
 */
export async function downloadBlankPdfPacket({ download }: FormConfig) {
  const { downloadBlankPdfs } = await import("#lib/pdfs/downloadBlankPdfs");

  await downloadBlankPdfs({
    title: download.title,
    instructions: resolveInstructions(download.instructions, {}),
    pdfs: download.pdfs.map(({ pdf }) => pdf),
  });
}
