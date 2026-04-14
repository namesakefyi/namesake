import type { FormData } from "../../constants/fields";
import type { PDFDefinition } from "../../constants/pdf";
import { fetchPdf } from "./fetchPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Fill out a PDF form with the given user data.
 * @returns PDF bytes for the filled form.
 */
export async function fillPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}): Promise<Uint8Array> {
  try {
    const { PDFDocument } = await loadPdfLib();

    // Fetch the PDF with form fields
    const formPdfBytes = await fetchPdf(pdf.pdfPath);

    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // Set the title
    pdfDoc.setTitle(pdf.title);
    pdfDoc.setAuthor("Filled by Namesake Collaborative");

    // Get the form containing all the fields
    const form = pdfDoc.getForm();

    // Fill out each field from the resolver
    const fields = pdf.resolver(userData);
    for (const [fieldName, value] of Object.entries(fields)) {
      if (value === undefined) continue;
      if (typeof value === "boolean") {
        const checkbox = form.getCheckBox(fieldName);
        value ? checkbox.check() : checkbox.uncheck();
      } else if (typeof value === "string") {
        const field = form.getTextField(fieldName);
        field.setText(value);
      }
    }

    // Serialize the PDFDocument to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
