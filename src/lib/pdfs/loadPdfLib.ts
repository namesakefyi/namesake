/**
 * Dynamically import and load the PDF library.
 * @returns PDF library utilities
 */
export async function loadPdfLib() {
  const {
    PDFDocument,
    PDFDropdown,
    popGraphicsState,
    pushGraphicsState,
    StandardFonts,
    setCharacterSpacing,
  } = await import("@cantoo/pdf-lib");

  return {
    PDFDocument,
    PDFDropdown,
    popGraphicsState,
    pushGraphicsState,
    StandardFonts,
    setCharacterSpacing,
  };
}
