import type { FormData, PDFDefinition } from "@/constants";
import { PDFDocument } from "@cantoo/pdf-lib";

/**
 * Fetch a PDF file from the /src/forms.
 */
export const fetchPdf = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF from "${path}": ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/pdf")) {
    throw new Error(
      `Invalid content type for "${path}": Expected PDF but got ${contentType}`,
    );
  }

  return response.arrayBuffer();
};

/**
 * Fill out a PDF form with the given user data.
 * @returns A URL to the filled PDF.
 */
export async function fillPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}): Promise<Uint8Array> {
  try {
    const pdfFields = pdf.fields(userData);

    // Fetch the PDF with form fields
    const formPdfBytes = await fetchPdf(pdf.pdfPath);

    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // Get the form containing all the fields
    const form = pdfDoc.getForm();

    // Fill out each field from our transformed data
    for (const [fieldName, value] of Object.entries(pdfFields)) {
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
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getForm();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Fill out a PDF form and download it.
 */
export async function downloadPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}) {
  const pdfBytes = await fillPdf({ pdf, userData });
  if (!pdfBytes) return;

  const url = URL.createObjectURL(new Blob([pdfBytes]));

  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdf.title}.pdf`;
    a.click();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Define a PDF form.
 * @returns A PDF definition.
 */
export function definePdf(pdf: PDFDefinition): PDFDefinition {
  return pdf;
}

export async function downloadMergedPdf({
  title,
  pdfs,
  userData,
}: { title: string; pdfs: PDFDefinition[]; userData: Partial<FormData> }) {
  const mergedPdf = await PDFDocument.create();

  for (const pdf of pdfs) {
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices(),
    );
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  const mergedPdfBytes = await mergedPdf.save();
  const url = URL.createObjectURL(new Blob([mergedPdfBytes]));

  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();
  } catch (error) {
    console.error(error);
  }
}
