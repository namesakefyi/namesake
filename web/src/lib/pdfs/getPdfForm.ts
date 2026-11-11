import type { PDFDefinition, PDFFieldValue } from "#constants/pdf";
import { fillPdf } from "./fillPdf";
import { loadPdfLib } from "./loadPdfLib";

/** Fills a PDF and reads its form back. Useful for testing. */
export async function getPdfForm(
  pdf: PDFDefinition,
  values: Readonly<Record<string, PDFFieldValue>>,
) {
  const { PDF } = await loadPdfLib();
  const pdfDoc = await PDF.load(await fillPdf(pdf, values));
  const form = pdfDoc.getForm();
  if (!form) throw new Error("PDF has no AcroForm");
  return form;
}
