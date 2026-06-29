import type { PdfFieldType } from "#constants/pdf";

/** Auto-generated from applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf — do not edit */

export const pdfSchema = {
  oldFullName: "text",
  oldGender: "radio",
  dateOfBirth: "text",
  birthplaceCity: "text",
  parent1Name: "text",
  parent2Name: "text",
  newFullName: "text",
  newGender: "radio",
  mailingAddress: "text",
  phoneNumber: "text",
  email: "text",
  nameChangeDecreeIncluded: "checkbox",
  paymentIncluded: "checkbox",
  guardianOneFullName: "text",
  guardianTwoFullName: "text",
} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;

export const pdfExcludedFields = [
  "Applicants contact information",
  "ParentGuardian1 SignatureDate",
  "ParentGuardian2 SignatureDate",
  "ParentGuardian2 SignatureX",
  "Signature of ParentGuardian 1 X",
  "Signature of Subject",
  "SubjectSignatureDate",
] as const;
