import type { PdfFieldType } from "#constants/pdf";

/** Auto-generated from background-check-authorization-of-release.pdf — do not edit */

export const pdfSchema = {
  fullName: "text",
  otherNames: "text",
  dateOfBirth: "text",
  residenceAddress: "text",
  nameChange: "text",
} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;
