/** Auto-generated from background-check-authorization-of-release.pdf — do not edit */
import { PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  fullName: PDFTextField,
  otherNames: PDFTextField,
  dateOfBirth: PDFTextField,
  residenceAddress: PDFTextField,
  nameChange: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
