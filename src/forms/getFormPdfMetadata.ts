import { type FormSlug, getFormConfig } from "../constants/forms";
import type { PDFId } from "../constants/pdf";
import { getPdfDefinition } from "../pdfs";

/**
 * Metadata for a PDF form that includes display information.
 */
export interface FormPdfMetadata {
  /** The unique PDF identifier */
  pdfId: PDFId;
  /** The display title of the PDF */
  title: string;
  /** The form code, if one exists (e.g., "CJP-27") */
  code?: string;
  /** Whether this PDF is conditionally included based on form data */
  conditional?: boolean;
}

/**
 * Get PDF metadata for a form to display on the forms index page.
 *
 * @param formSlug - The form slug identifier
 * @returns Array of PDF metadata including title, code, and whether it's conditional
 */
export async function getFormPdfMetadata(
  formSlug: FormSlug,
): Promise<FormPdfMetadata[]> {
  const config = getFormConfig(formSlug);
  if (!config) return [];

  return await Promise.all(
    config.pdfs.map(async (pdf) => {
      const definition = await getPdfDefinition(pdf.pdfId);
      return {
        pdfId: pdf.pdfId,
        title: definition.title,
        code: definition.code,
        conditional: !!pdf.when,
      };
    }),
  );
}
