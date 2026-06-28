/** Auto-generated from background-check-authorization-of-release.pdf — do not edit */

export const pdfSchema = {
  fullName: "text",
  otherNames: "text",
  dateOfBirth: "text",
  residenceAddress: "text",
  nameChange: "text",
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
