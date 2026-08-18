import { type FormConfig, resolveInstructions } from "#constants/forms";

/**
 * Downloads every PDF for a form, unfilled, with a cover page. PDF
 * lib and utilities are loaded on demand when the user clicks download.
 */
export async function downloadBlankPdfPacket(config: FormConfig) {
  const [{ loadPdfs }, { downloadBlankPdfs }] = await Promise.all([
    import("#lib/pdfs/loadPdfs"),
    import("#lib/pdfs/downloadBlankPdfs"),
  ]);

  const pdfs = await loadPdfs(config.pdfs.map((pdf) => ({ pdfId: pdf.pdfId })));

  const instructions = resolveInstructions(config.instructions, {});

  await downloadBlankPdfs({
    title: config.downloadTitle,
    instructions,
    pdfs,
  });
}
