import type { PDFForm } from "@libpdf/core";
import type { PdfDefinition, PdfFieldValue } from "#constants/pdf";
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
  value: NonNullable<PdfFieldValue>,
) {
  const radio = form.getRadioGroup(name);
  if (!radio) return value;
  const option = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return typeof option === "string" && radio.getOptions().includes(option)
    ? option
    : undefined;
}

export async function fillPdf(
  pdf: PdfDefinition,
  values: Readonly<Record<string, PdfFieldValue>>,
): Promise<Uint8Array> {
  const [{ PDF }, formPdfBytes] = await Promise.all([
    loadPdfLib(),
    fetchPdf(pdf.file),
  ]);

  // PDF.load requires a Uint8Array, not an ArrayBuffer.
  const pdfDoc = await PDF.load(new Uint8Array(formPdfBytes));
  pdfDoc.setTitle(pdf.title);
  pdfDoc.setAuthor("Filled by Namesake Collaborative");

  const form = pdfDoc.getForm();
  if (form) {
    const filled: Record<string, NonNullable<PdfFieldValue>> = {};
    for (const [name, resolved] of Object.entries(values)) {
      if (resolved == null) continue;
      const value = toFieldValue(form, name, resolved);
      if (value !== undefined) filled[name] = value;
    }
    form.fill(filled);
  }

  return pdfDoc.save();
}
