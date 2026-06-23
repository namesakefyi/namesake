/** Auto-generated from applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf — do not edit */
import { PDFCheckBox, PDFRadioGroup, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  oldFullName: PDFTextField,
  oldGender: PDFRadioGroup,
  dateOfBirth: PDFTextField,
  birthplaceCity: PDFTextField,
  parent1Name: PDFTextField,
  parent2Name: PDFTextField,
  newFullName: PDFTextField,
  newGender: PDFRadioGroup,
  mailingAddress: PDFTextField,
  phoneNumber: PDFTextField,
  email: PDFTextField,
  nameChangeDecreeIncluded: PDFCheckBox,
  paymentIncluded: PDFCheckBox,
  guardianOneFullName: PDFTextField,
  guardianTwoFullName: PDFTextField,
} as const;

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
