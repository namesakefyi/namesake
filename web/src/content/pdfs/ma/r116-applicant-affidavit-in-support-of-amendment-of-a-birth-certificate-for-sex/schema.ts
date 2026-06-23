/** Auto-generated from applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf — do not edit */
import { PDFCheckBox, PDFRadioGroup, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  currentLegalName: PDFTextField,
  currentGender: PDFRadioGroup,
  dateOfBirth: PDFTextField,
  birthplaceCity: PDFTextField,
  parent1Name: PDFTextField,
  parent2Name: PDFTextField,
  newFullName: PDFTextField,
  newGender: PDFRadioGroup,
  mailingAddress: PDFTextField,
  contactInformation: PDFTextField,
  phoneNumber: PDFTextField,
  email: PDFTextField,
  nameChangeDecreeIncluded: PDFCheckBox,
  paymentIncluded: PDFCheckBox,
  "Name of Parent/Guardian1": PDFTextField,
  "Name of Parent/Guardian2": PDFTextField,
  parent1Signature: PDFTextField,
  parent1SignatureDate: PDFTextField,
  parent2Signature: PDFTextField,
  parent2SignatureDate: PDFTextField,
  signature: PDFTextField,
  signatureDate: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
