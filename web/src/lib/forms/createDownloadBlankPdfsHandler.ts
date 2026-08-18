import { type FormConfig, resolveInstructions } from "#constants/forms";

/**
 * Creates a handler that downloads every PDF for a form, unfilled, merged
 * with a cover page. PDF lib and utilities are loaded on demand when the
 * user clicks download.
 */
export function createDownloadBlankPdfsHandler(config: FormConfig) {
  return async () => {
    const [{ loadPdfs }, { downloadBlankPdfs }] = await Promise.all([
      import("#lib/pdfs/loadPdfs"),
      import("#lib/pdfs/downloadBlankPdfs"),
    ]);

    const pdfs = await loadPdfs(
      config.pdfs.map((pdf) => ({ pdfId: pdf.pdfId })),
    );

    const instructions = resolveInstructions(config.instructions, {});

    await downloadBlankPdfs({
      title: config.downloadTitle,
      instructions,
      pdfs,
    });
  };
}
