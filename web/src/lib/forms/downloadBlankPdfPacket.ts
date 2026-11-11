import { type FormDownload, resolveInstructions } from "#constants/forms";

export async function downloadBlankPdfPacket(
  loadDownload: () => Promise<FormDownload>,
) {
  const [download, { downloadPdfPacket }] = await Promise.all([
    loadDownload(),
    import("#lib/pdfs/downloadPdfPacket"),
  ]);

  await downloadPdfPacket({
    title: download.title,
    instructions: resolveInstructions(download.instructions, {}),
    pdfs: download.pdfs,
  });
}
