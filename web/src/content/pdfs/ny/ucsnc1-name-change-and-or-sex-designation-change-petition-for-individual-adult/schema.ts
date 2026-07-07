/** Auto-generated from ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf — do not edit */

import type { PdfFieldType } from "#constants/pdf";

export const pdfSchema = {
  shouldSealCourtRecord: "radio",
  hasBeenConvictedOfCrime: "radio",
  reasonToSealCourtRecord: "text",
  reasonForChangingName: "text",
  courtOfConviction: "text",
  courtType: "text",
  crime: "text",
  county: "text",
  hasFiledForBankruptcy: "radio",
  currentLegalName: "text",
  indexNumber: "text",
  hasJudgmentsOrLiens: "radio",
  isPartyToLawsuitOrCourtCase: "radio",
  hasAttachedSupportingDocuments: "radio",
  isRequestingNameChange: "checkbox",
  isRequestingSexDesignationChange: "checkbox",
  bankruptcyJudgmentsLiensDetails: "text",
  supportingDocumentsDetails: "text",
  newGender: "text",
  hasPreviouslyFiledSexDesignationChange: "radio",
  previouslyFiledSexDesignationChangeDetails: "text",
  isCurrentlyMarried: "radio",
  wasPreviouslyMarried: "radio",
  hasChildrenUnder21: "radio",
  isProvidingReasonForGenderChange: "radio",
  paysChildSupport: "radio",
  signatureDate: "text",
  areChildSupportPaymentsUpToDate: "radio",
  reasonForGenderChange: "text",
  childSupportArrearsAmount: "text",
  newFullName: "text",
  courtIssuingChildSupportOrder: "text",
  petitionDay: "text",
  petitionMonth: "text",
  supportCollectionsUnit: "text",
  petitionYearSuffix: "text",
  placeOfBirth: "text",
  paysSpousalSupport: "radio",
  areSpousalSupportPaymentsUpToDate: "radio",
  spousalSupportArrearsAmount: "text",
  courtIssuingSpousalSupportOrder: "text",
  hasPreviousNameChangeTrue: "radio",
  hasPreviousNameChangeFalse: "radio",
  currentAge: "text",
  dateOfBirth: "text",
  previousNameChangeDetails: "text",
  residenceAddress: "text",
} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;

/** Fields present in the PDF but excluded from the schema */
export const pdfExcludedFields = ["Print_Form", "Reset_Form"] as const;
