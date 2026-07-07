/** Auto-generated from ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf — do not edit */

import type { PdfFieldType } from "#constants/pdf";

export const pdfSchema = {
  SealingRequest: "radio",
  "SealingRequest-specify": "text",
  SupportingDocument: "radio",
  SpousalSupportPayments: "radio",
  PreviousNameChangePetition: "radio",
  Print_Form: "button",
} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;

/** Fields present in the PDF but excluded from the schema */
export const pdfExcludedFields = [
  "AffirmDay",
  "AffirmMonth",
  "AffirmYear",
  "Age",
  "Bankruptcy",
  "BankruptcyJudgmentsLiensParty-specify",
  "ChildSupport",
  "ChildSupportArrears",
  "ChildSupportPayments",
  "ChildrenUnder21",
  "ConvictedOfCrime",
  "County",
  "CourtIssuingChildSupportOrder",
  "CourtIssuingSpousalSupportOrder",
  "CourtOfConviction",
  "CourtType",
  "Crime",
  "CurrentAddress",
  "CurrentlyMarried",
  "DOB",
  "IndexNumber",
  "JudgmentsOrLiens",
  "NameChange",
  "NewName",
  "NewSexDesignation",
  "PartyToAction",
  "PetitionerName",
  "PlaceOfBirth",
  "PreviousNameChagePetition-specify",
  "PreviousNameChangePetition0",
  "PreviousSexDesignationChangeRequest",
  "PreviousSexDesignationChangeRequest-specify",
  "PreviouslyMarried",
  "ReasonsForNameChangeRequest-specify",
  "ReasonsForSexDesignationChangeRequest",
  "ReasonsForSexDesignationChangeRequest-specify",
  "Reset_Form",
  "SexDesignationChange",
  "SignatureDate",
  "SpousalSupport",
  "SpousalSupportArrears",
  "SupportCollectionsUnit",
  "SupportingDocument-specify",
] as const;
