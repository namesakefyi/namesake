import type { FormData } from "@/constants/forms";
import type { Jurisdiction } from "@/constants/quests";
import { PDFDocument } from "@cantoo/pdf-lib";

type PDFFields = Record<string, string | boolean | undefined>;

/**
 * A definition of a PDF form and its fields.
 */
export interface PDFDefinition {
  /**
   * The path to the PDF file, imported as a module.
   */
  pdfPath: string;

  /**
   * The title of the form. Do not include the form code or state.
   * @example "Petition to Change Name of Adult"
   */
  title: string;

  /**
   * The form code, if one exists.
   * @optional
   * @example "CJP 27"
   */
  code?: string;

  /**
   * Two-letter state abbreviation the form is for.
   * @optional
   * @example "MA"
   */
  jurisdiction?: Jurisdiction;

  /**
   * A function that transforms the user data into a set of fields for the PDF.
   *
   * PDF field names may be in a variety of formats, from camelCase
   * to snake_case to a "Plain String" label. It's recommended to
   * rename fields into a consistent format matching our own schema
   * for ease of readability and testing.
   *
   * @url https://github.com/namesakefyi/namesake/tree/main/src/forms/README.md
   *
   * @example
   * ```ts
   * fields: (data) => ({
   *   firstNameField: data.newFirstName,
   *   middle_name_field: data.newMiddleName,
   *   "Last Name Field": data.newLastName,
   * })
   * ```
   */
  fields: (data: Partial<FormData>) => PDFFields;
}

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
export function definePdf(definition: PDFDefinition): PDFDefinition {
  return definition;
}
