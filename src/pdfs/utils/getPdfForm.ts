import type { FormData } from "../../constants/fields";
import type { PDFDefinition } from "../../constants/pdf";
import { fillPdf } from "./fillPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * This is a helper function that returns the form object from a filled PDF.
 * Useful for testing.
 */
export async function getPdfForm({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}) {
  try {
    const { PDFDocument } = await loadPdfLib();
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getForm();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
