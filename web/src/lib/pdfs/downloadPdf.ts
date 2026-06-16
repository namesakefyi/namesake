/**
 * Given PDF bytes and a title, download the PDF.
 * @param pdfBytes - The PDF bytes to download.
 * @param title - The title of the PDF.
 * @returns A promise that resolves when the PDF is downloaded.
 */
export async function downloadPdf({
  pdfBytes,
  title,
}: {
  pdfBytes: Uint8Array;
  title: string;
}) {
  const url = URL.createObjectURL(new Blob([pdfBytes as BlobPart]));

  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();
  } catch (error) {
    console.error(error);
  }
}
