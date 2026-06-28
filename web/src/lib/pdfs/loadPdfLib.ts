/**
 * Dynamically import and load the PDF library.
 * @returns PDF library utilities
 */
export async function loadPdfLib() {
  const { PDF, StandardFonts } = await import("@libpdf/core");

  return {
    PDF,
    StandardFonts,
  };
}
