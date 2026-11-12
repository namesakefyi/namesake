import type { PdfDefinition, PdfFieldValue } from "#constants/pdf";
import { fillPdf } from "../fillPdf";
import { loadPdfLib } from "../loadPdfLib";

/** Fills a PDF and reads its form back. Useful for testing. */
export async function getPdfForm(
  pdf: PdfDefinition,
  values: Readonly<Record<string, PdfFieldValue>>,
) {
  const { PDF } = await loadPdfLib();
  const pdfDoc = await PDF.load(await fillPdf(pdf, values));
  const form = pdfDoc.getForm();
  if (!form) throw new Error("PDF has no AcroForm");
  return form;
}
