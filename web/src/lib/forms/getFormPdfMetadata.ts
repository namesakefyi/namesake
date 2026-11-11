import { getFormConfig } from "./getFormConfig";

/** What the forms list and title step show about each of a form's PDFs. */
export interface FormPdfMetadata {
  title: string;
  /** The form code, if one exists, such as "CJP-27". */
  code?: string;
  /** Whether the PDF is included only for some answers. */
  conditional?: boolean;
  /** The blank PDF file. */
  file: string;
}

/** @param formId - The form's id, such as `ma/court-order` */
export function getFormPdfMetadata(formId: string): FormPdfMetadata[] {
  const config = getFormConfig(formId);
  if (!config) return [];

  return config.download.pdfs.map(({ pdf, when }) => ({
    title: pdf.title,
    code: pdf.code,
    conditional: !!when,
    file: pdf.file,
  }));
}
