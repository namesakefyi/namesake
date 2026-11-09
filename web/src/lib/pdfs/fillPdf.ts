import type { PDFForm } from "@libpdf/core";
import type { FormData } from "#constants/fields";
import type { PDFDefinition, PDFFieldValue } from "#constants/pdf";
import { fetchPdf } from "./fetchPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Prepare a resolved value for its PDF field. Radio groups take an option
 * name, so a yes/no answer selects the "Yes" or "No" option, and an answer
 * the radio group has no option for, like "dontKnow", leaves it blank.
 */
function toFieldValue(
  form: PDFForm,
  name: string,
  value: NonNullable<PDFFieldValue>,
) {
  const radio = form.getRadioGroup(name);
  if (!radio) return value;
  const option = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return typeof option === "string" && radio.getOptions().includes(option)
    ? option
    : undefined;
}

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
    if (form) {
      const values: Record<string, NonNullable<PDFFieldValue>> = {};
      for (const [name, resolved] of Object.entries(fields)) {
        if (resolved == null) continue;
        const value = toFieldValue(form, name, resolved);
        if (value !== undefined) values[name] = value;
      }
      form.fill(values);
    }

    // Serialize the PDFDocument to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
