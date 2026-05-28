/** Auto-generated from cjp34-cori-and-wms-release-request.pdf — do not edit */
import { PDFCheckBox, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  caseName: PDFTextField,
  county: PDFTextField,
  isChangeOfNameProceeding: PDFCheckBox,
  oldName: PDFTextField,
  dateOfBirth: PDFTextField,
  ssnLastFour: PDFTextField,
  mothersMaidenName: PDFTextField,
  otherNamesOrAliases: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
