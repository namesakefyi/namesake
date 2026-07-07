/** Auto-generated from ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf — do not edit */

import type { PdfFieldType } from "#constants/pdf";

export const pdfSchema = {
  sealCourtRecord: "radio",
  hasBeenConvictedOfCrime: "radio",
  reasonForSealingCourtRecord: "text",
  reasonForChangingName: "text",
  courtOfConvictionOfCrime: "text",
  courtType: "text",
  crime: "text",
  county: "text",
  hasFiledForBankruptcy: "radio",
  currentLegalName: "text",
  indexNumber: "text",
  hasJudgementsOrLiens: "radio",
  isPartyToLawsuitOrCourtCase: "radio",
  hasAttachedSupportingDocuments: "radio",
  isRequestingNameChange: "checkbox",
  isRequestingSexDesignationChange: "checkbox",
  bankruptcyJudgementsLiensDetails: "text",
  supportingDocumentsDetails: "text",
  newGender: "text",
  hasPreviouslyFiledSexDesginationChange: "radio",
  previouslyFiledSexDesginationChangeDetails: "text",
  isMarries: "radio",
  wasPreviouslyMarried: "radio",
  hasChildrenUnder21: "radio",
  wantsToProvideGenderChangeReason: "radio",
  paysChildSupport: "radio",
  signatureDate: "text",
  areChildSupportPaymentsUpToDate: "radio",
  reasonForGenderChange: "text",
  childSupportOwed: "text",
  newFullName: "text",
  courtIssuingChildSupportOrder: "text",
  petitionDay: "text",
  petitionMonth: "text",
  SupportCollectionsUnit: "text",
  petitionYearSuffix: "text",
  placeOfBirth: "text",
  paysSpousalSupport: "radio",
  areSposualSupportPaymentsUpToDate: "radio",
  spousalSupportPaymentsOwed: "text",
  courtIssuingSpousalSupportOrder: "text",
  hasPreviouslyFiledNameChangePetition: "radio",
  hasNotPreviouslyFiledNameChangePetition: "radio",
  currentAge: "text",
  dateOfBirth: "text",
  previousNameChangePetitionDetails: "text",
  residenceAddress: "text",
} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;

/** Fields present in the PDF but excluded from the schema */
export const pdfExcludedFields = ["Print_Form", "Reset_Form"] as const;
