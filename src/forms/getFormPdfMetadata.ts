import type { PDFId } from "../constants/pdf";
import { getPdfDefinition } from "../pdfs";
import { getFormConfig } from "./getFormConfig";

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

export async function getFormPdfMetadata(
  slug: string,
): Promise<FormPdfMetadata[]> {
  const config = getFormConfig(slug);
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
