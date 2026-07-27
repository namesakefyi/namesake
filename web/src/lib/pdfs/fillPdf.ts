import type { FormData } from "#constants/fields";
import type { PDFDefinition, PDFFieldValue } from "#constants/pdf";
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
    const { PDF } = await loadPdfLib();

    // Fetch the PDF with form fields
    const formPdfBytes = await fetchPdf(pdf.pdfPath);

    // Load a PDF with form fields (PDF.load requires Uint8Array, not ArrayBuffer)
    const pdfDoc = await PDF.load(new Uint8Array(formPdfBytes));

    // Set the title
    pdfDoc.setTitle(pdf.title);
    pdfDoc.setAuthor("Filled by Namesake Collaborative");

    // Get the form containing all the fields
    const form = pdfDoc.getForm();

    // Fill out each field from the resolver
    const fields = pdf.resolver(userData);
    form?.fill(
      Object.fromEntries(
        Object.entries(fields).filter(
          (e): e is [string, NonNullable<PDFFieldValue>] => e[1] != null,
        ),
      ),
    );

    // Serialize the PDFDocument to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
