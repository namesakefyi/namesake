import type { Jurisdiction, UserFormDataField } from "@convex/constants";
import { PDFDocument } from "pdf-lib";

type UserFormData = {
  [K in UserFormDataField]: string | boolean | undefined;
};

type PDFFields = Record<string, string | boolean | undefined>;

type FieldTransformer<T extends Partial<UserFormData>> = (data: T) => PDFFields;

/**
 * A definition of a PDF form and its fields.
 */
export interface PDFDefinition<T extends Partial<UserFormData>> {
  /**
   * The path to the PDF file, assuming the root of `/public`.
   * @example "/forms/ma/cjp27-petition-to-change-name-of-adult.pdf"
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
   * @example
   * ```ts
   * fields: (data: {
   *   newFirstName: string;
   *   newMiddleName: string;
   *   newLastName: string;
   * }) => ({
   *   "First name": data.newFirstName,
   *   "Middle name": data.newMiddleName,
   *   "Last name": data.newLastName,
   * })
   * ```
   */
  fields: FieldTransformer<T>;
}

/**
 * Fill out a PDF form with the given user data.
 * @returns A URL to the filled PDF.
 */
export async function fillPdf<T extends Partial<UserFormData>>({
  pdf,
  userData,
}: {
  pdf: PDFDefinition<T>;
  userData: T;
}): Promise<Uint8Array> {
  // Get all computed fields for the PDF
  const pdfFields = pdf.fields(userData);

  try {
    // Fetch the PDF with form fields
    const formUrl = pdf.pdfPath;
    const response = await fetch(formUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF from "${formUrl}": ${response.statusText}`,
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/pdf")) {
      throw new Error(
        `Invalid content type for "${formUrl}": Expected PDF but got ${contentType}`,
      );
    }

    const formPdfBytes = await response.arrayBuffer();

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
    console.error("Error in fillPdf:", error);
    throw error;
  }
}

/**
 * Fill out a PDF form and download it.
 */
export async function downloadPdf<T extends Partial<UserFormData>>({
  pdf,
  userData,
}: {
  pdf: PDFDefinition<T>;
  userData: T;
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
export function definePdf<T extends Partial<UserFormData>>(
  definition: PDFDefinition<T>,
): PDFDefinition<T> {
  return definition;
}
