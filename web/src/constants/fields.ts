import { ALL } from "./all";

export const PREFER_NOT_TO_ANSWER = "preferNotToAnswer";
export const DONT_KNOW = "dontKnow";

export type ExtraChoice = typeof PREFER_NOT_TO_ANSWER | typeof DONT_KNOW;

/** How an extra choice reads on the review page and in its input. */
export const EXTRA_CHOICE_LABELS: Readonly<Record<string, string>> = {
  [PREFER_NOT_TO_ANSWER]: "Prefer not to answer",
  [DONT_KNOW]: "I don’t know",
} satisfies Record<ExtraChoice, string>;

export const FIELD_DEFS = [
  { name: "oldFirstName", type: "string" },
  { name: "oldMiddleName", type: "string" },
  { name: "oldLastName", type: "string" },
  { name: "newFirstName", type: "string" },
  { name: "newMiddleName", type: "string" },
  { name: "newLastName", type: "string" },
  {
    name: "reasonForChangingName",
    type: "string",
  },
  { name: "phoneNumber", type: "string" },
  { name: "email", type: "string" },
  { name: "dateOfBirth", type: "string" },
  { name: "birthplaceCity", type: "string" },
  { name: "birthplaceState", type: "string" },
  { name: "birthplaceCountry", type: "string" },
  {
    name: "isALegalParentDeceased",
    type: "boolean",
  },
  {
    name: "isAllGuardiansAssenting",
    type: "boolean",
  },
  {
    name: "isCurrentlyUnhoused",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForChild",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForGuardian",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForParent1",
    type: "boolean",
  },
  {
    name: "isInterpreterNeededForParent2",
    type: "boolean",
  },
  {
    name: "areBothParentsListedOnBirthCertificate",
    type: "boolean",
  },
  {
    name: "isParent1Assenting",
    type: "boolean",
  },
  {
    name: "isParent2Assenting",
    type: "boolean",
  },
  {
    name: "isPresentedByCourtAppointedGuardian",
    type: "boolean",
  },
  {
    name: "isPresentedByLegalFatherParent2",
    type: "boolean",
  },
  {
    name: "isPresentedByLegalMotherParent1",
    type: "boolean",
  },
  {
    name: "isUnderSupervisionOfMassDeptOfYouthServices",
    type: "boolean",
  },
  {
    name: "hasNoRecordOfOtherStateConvictionsProbationParole",
    type: "boolean",
  },
  {
    name: "residenceStreetAddress",
    type: "string",
  },
  {
    name: "residenceStreetAddress2",
    type: "string",
  },

  { name: "residenceCity", type: "string" },
  { name: "residenceCounty", type: "string" },
  { name: "residenceState", type: "string" },
  { name: "residenceZipCode", type: "string" },
  {
    name: "isMailingAddressDifferentFromResidence",
    type: "boolean",
  },
  {
    name: "mailingStreetAddress",
    type: "string",
  },
  {
    name: "mailingStreetAddress2",
    type: "string",
  },
  { name: "mailingCity", type: "string" },
  { name: "mailingCounty", type: "string" },
  { name: "mailingState", type: "string" },
  { name: "mailingZipCode", type: "string" },
  {
    name: "hasPreviousNameChange",
    type: "boolean",
  },
  { name: "previousNameFrom", type: "string" },
  { name: "previousNameTo", type: "string" },
  { name: "previousNameReason", type: "string" },
  {
    name: "hasUsedOtherNameOrAlias",
    type: "boolean",
  },
  {
    name: "otherNamesOrAliases",
    type: "string",
  },
  {
    name: "parent1City",
    type: "string",
  },
  {
    name: "parent1DissentReason",
    type: "string",
  },
  {
    name: "parent1Email",
    type: "string",
  },
  {
    name: "parent1FullName",
    type: "string",
  },
  { name: "parent1FirstName", type: "string" },
  { name: "parent1MiddleName", type: "string" },
  { name: "parent1LastName", type: "string" },
  {
    name: "parent1Phone",
    type: "string",
  },
  {
    name: "parent1State",
    type: "string",
  },
  {
    name: "parent1StreetAddress",
    type: "string",
  },
  {
    name: "parent1ZipCode",
    type: "string",
  },
  {
    name: "parent2City",
    type: "string",
  },
  {
    name: "parent2DissentReason",
    type: "string",
  },
  {
    name: "parent2Email",
    type: "string",
  },
  {
    name: "parent2FullName",
    type: "string",
  },
  { name: "parent2FirstName", type: "string" },
  { name: "parent2MiddleName", type: "string" },
  { name: "parent2LastName", type: "string" },
  {
    name: "parent2Phone",
    type: "string",
  },
  {
    name: "parent2State",
    type: "string",
  },
  {
    name: "parent2StreetAddress",
    type: "string",
  },
  {
    name: "parent2ZipCode",
    type: "string",
  },
  {
    name: "parentsHaveUnknownAddresses",
    type: "boolean",
  },
  {
    name: "parentsHaveDifferentAddresses",
    type: "boolean",
  },
  {
    name: "hasOtherLegalNames",
    type: "boolean",
  },
  { name: "previousLegalNames", type: "string" },
  {
    name: "isInterpreterNeeded",
    type: "boolean",
  },
  { name: "language", type: "string" },
  {
    name: "isOkayToSharePronouns",
    type: "boolean",
  },
  { name: "pronouns", type: "string[]" },
  { name: "otherPronouns", type: "string" },
  {
    name: "shouldReturnOriginalDocuments",
    type: "boolean",
  },
  {
    name: "shouldWaivePublicationRequirement",
    type: "boolean",
  },
  {
    name: "reasonToWaivePublication",
    type: "string",
  },
  {
    name: "shouldImpoundCourtRecords",
    type: "boolean",
  },
  {
    name: "reasonToImpoundCourtRecords",
    type: "string",
  },
  {
    name: "shouldApplyForFeeWaiver",
    type: "boolean",
  },
  { name: "mothersMaidenName", type: "string" },
  { name: "occupation", type: "string" },
  { name: "maritalStatus", type: "string" },
  {
    name: "previousAddresses",
    type: "string[]",
  },
  {
    name: "shouldChangeBirthCertificate",
    type: "boolean",
  },
  {
    name: "citizenshipStatus",
    type: "string",
  },
  {
    name: "coGuardianCity",
    type: "string",
  },
  {
    name: "coGuardianEmail",
    type: "string",
  },
  { name: "coGuardianFirstName", type: "string" },
  { name: "coGuardianMiddleName", type: "string" },
  { name: "coGuardianLastName", type: "string" },
  {
    name: "coGuardianPhone",
    type: "string",
  },
  {
    name: "coGuardianState",
    type: "string",
  },
  {
    name: "coGuardianStreetAddress",
    type: "string",
  },
  {
    name: "coGuardianZipCode",
    type: "string",
  },
  {
    name: "sexAssignedAtBirth",
    type: "string",
  },
  {
    name: "isHispanicOrLatino",
    type: "boolean",
    extraChoices: [PREFER_NOT_TO_ANSWER],
  },
  {
    name: "race",
    type: "string[]",
  },
  {
    name: "mothersFirstName",
    type: "string",
  },
  {
    name: "mothersMiddleName",
    type: "string",
  },
  {
    name: "mothersLastName",
    type: "string",
  },
  {
    name: "fathersFirstName",
    type: "string",
  },
  {
    name: "fathersMiddleName",
    type: "string",
  },
  {
    name: "fathersLastName",
    type: "string",
  },
  {
    name: "guardianCity",
    type: "string",
  },
  {
    name: "guardianDissentReason",
    type: "string",
  },
  {
    name: "guardianEmail",
    type: "string",
  },
  { name: "guardianFirstName", type: "string" },
  { name: "guardianMiddleName", type: "string" },
  { name: "guardianLastName", type: "string" },
  {
    name: "guardianPhone",
    type: "string",
  },
  {
    name: "guardianState",
    type: "string",
  },
  {
    name: "guardianStreetAddress",
    type: "string",
  },
  {
    name: "guardianZipCode",
    type: "string",
  },
  {
    name: "hasCourtAppointedCoGuardian",
    type: "boolean",
  },
  {
    name: "hasCourtAppointedGuardian",
    type: "boolean",
  },
  {
    name: "hasLegalParentHadParentalRightsTerminated",
    type: "boolean",
  },
  {
    name: "hasPreviousSocialSecurityCard",
    type: "boolean",
    extraChoices: [DONT_KNOW],
  },
  {
    name: "previousSocialSecurityCardFirstName",
    type: "string",
  },
  {
    name: "previousSocialSecurityCardMiddleName",
    type: "string",
  },
  {
    name: "previousSocialSecurityCardLastName",
    type: "string",
  },
  {
    name: "isFilingForSomeoneElse",
    type: "boolean",
  },
  {
    name: "relationshipToFilingFor",
    type: "string",
  },
  {
    name: "relationshipToFilingForOther",
    type: "string",
  },
  {
    name: "indigencyBasis",
    type: "string",
    values: ["public-assistance", "income", "unable-to-pay", "none"],
  },
  { name: "isReceivingTAFDC", type: "boolean" },
  { name: "isReceivingEAEDC", type: "boolean" },
  {
    name: "isReceivingMedicaid",
    type: "boolean",
  },
  { name: "isReceivingSSI", type: "boolean" },
  {
    name: "isReceivingVeteransBenefits",
    type: "boolean",
  },
  {
    name: "incomeAmount",
    type: "string",
  },
  {
    name: "incomePeriod",
    type: "string",
    values: ["weekly", "biweekly", "monthly", "yearly"],
  },
  { name: "householdSize", type: "string" },
  { name: "numberOfDependents", type: "string" },
  {
    name: "otherHouseholdIncome",
    type: "string",
  },
  {
    name: "shouldWaiveFilingFeeAndSurcharge",
    type: "boolean",
  },
  {
    name: "filingFeeAndSurcharge",
    type: "string",
  },
  {
    name: "shouldWaiveFilingFeeAndSurchargeForAppeal",
    type: "boolean",
  },
  {
    name: "filingFeeAndSurchargeForAppeal",
    type: "string",
  },
  {
    name: "shouldWaiveFeesForCourtSummons",
    type: "boolean",
  },
  {
    name: "feesForCourtSummons",
    type: "string",
  },
  {
    name: "shouldWaiveOtherFeesSection2",
    type: "boolean",
  },
  {
    name: "otherFeesSection2",
    type: "string",
  },
  {
    name: "otherFeesSection2Details",
    type: "string",
  },
  {
    name: "applySubstitutionSection2",
    type: "boolean",
  },
  {
    name: "substitutionDetailsSection2",
    type: "string",
  },
  {
    name: "shouldWaiveExpertServices",
    type: "boolean",
  },
  {
    name: "costOfExpertServices",
    type: "string",
  },
  {
    name: "expertServicesDetails",
    type: "string",
  },
  {
    name: "shouldWaiveCostOfTranscription",
    type: "boolean",
  },
  {
    name: "costOfTranscription",
    type: "string",
  },
  {
    name: "shouldWaiveRecordingOfTrialForAppeal",
    type: "boolean",
  },
  {
    name: "shouldWaiveAppealBond",
    type: "boolean",
  },
  {
    name: "shouldWaiveCostOfWrittenTranscriptPreparation",
    type: "boolean",
  },
  {
    name: "costOfWrittenTranscriptPreparation",
    type: "string",
  },
  {
    name: "shouldWaiveOtherFeesSection3",
    type: "boolean",
  },
  {
    name: "otherFeesSection3",
    type: "string",
  },
  {
    name: "otherFeesSection3Details",
    type: "string",
  },
  {
    name: "applySubstitutionSection3",
    type: "boolean",
  },
  {
    name: "substitutionDetailsSection3",
    type: "string",
  },
  {
    name: "oldGender",
    type: "string",
  },
  {
    name: "newGender",
    type: "string",
  },
  {
    // Specific to R-116 in MA
    name: "nameChangeDecreeIncluded",
    type: "boolean",
  },
  {
    // Specific to R-116 in MA
    name: "paymentIncluded",
    type: "boolean",
  },
  {
    name: "guardianOneFullName",
    type: "string",
  },
  {
    name: "guardianTwoFullName",
    type: "string",
  },
  {
    name: "waiveDocumentFees",
    type: "boolean",
  },
  // New York adult court-order petition (UCS-NC1).
  {
    name: "birthplaceRegion",
    type: "string",
  },
  {
    name: "nyCourtOrderRequest",
    type: "string",
  },
  { name: "courtType", type: "string" },
  {
    name: "hasBeenConvictedOfCrime",
    type: "boolean",
  },
  { name: "courtOfConviction", type: "string" },
  { name: "crime", type: "string" },
  {
    name: "hasFiledForBankruptcy",
    type: "boolean",
  },
  {
    name: "hasJudgmentsOrLiens",
    type: "boolean",
  },
  {
    name: "isPartyToLawsuitOrCourtCase",
    type: "boolean",
  },
  {
    name: "bankruptcyJudgmentsLiensDetails",
    type: "string",
  },
  { name: "isCurrentlyMarried", type: "boolean" },
  {
    name: "wasPreviouslyMarried",
    type: "boolean",
  },
  { name: "hasChildrenUnder21", type: "boolean" },
  {
    name: "paysChildSupport",
    type: "boolean",
  },
  {
    name: "areChildSupportPaymentsUpToDate",
    type: "boolean",
  },
  {
    name: "childSupportArrearsAmount",
    type: "string",
  },
  {
    name: "courtIssuingChildSupportOrder",
    type: "string",
  },
  {
    name: "supportCollectionsUnit",
    type: "string",
  },
  {
    name: "paysSpousalSupport",
    type: "boolean",
  },
  {
    name: "areSpousalSupportPaymentsUpToDate",
    type: "boolean",
  },
  {
    name: "spousalSupportArrearsAmount",
    type: "string",
  },
  {
    name: "courtIssuingSpousalSupportOrder",
    type: "string",
  },
  {
    name: "hasPreviouslyFiledNameChange",
    type: "boolean",
  },
  {
    name: "previousNameChangePetitionDetails",
    type: "string",
  },
  {
    name: "hasPreviouslyFiledSexDesignationChange",
    type: "boolean",
  },
  {
    name: "previouslyFiledSexDesignationChangeDetails",
    type: "string",
  },
  {
    name: "isProvidingReasonForGenderChange",
    type: "boolean",
  },
  {
    name: "reasonForGenderChange",
    type: "string",
  },
  {
    name: "shouldSealCourtRecord",
    type: "boolean",
  },
  {
    name: "reasonToSealCourtRecord",
    type: "string",
  },
  {
    name: "hasAttachedSupportingDocuments",
    type: "boolean",
  },
  {
    name: "supportingDocumentsDetails",
    type: "string",
  },
] as const;

type FieldDef = (typeof FIELD_DEFS)[number];

export type FieldName = FieldDef["name"];

type DefinitionOf<K extends FieldName> = Extract<FieldDef, { name: K }>;

export type BooleanFieldName = Extract<FieldDef, { type: "boolean" }>["name"];
export type StringFieldName = Extract<FieldDef, { type: "string" }>["name"];
export type ListFieldName = Extract<FieldDef, { type: "string[]" }>["name"];
export type ValuedFieldName = Extract<FieldDef, { values: object }>["name"];
export type TextFieldName = Exclude<StringFieldName, ValuedFieldName>;

/** The extra choices a boolean field accepts besides yes and no. */
export type FieldExtraChoice<K extends FieldName> =
  DefinitionOf<K> extends {
    extraChoices: readonly (infer C extends ExtraChoice)[];
  }
    ? C
    : never;

/** The allowed values of a field, or `string` when none are declared. */
export type FieldValue<K extends FieldName> =
  DefinitionOf<K> extends { values: readonly (infer V extends string)[] }
    ? V
    : string;

export type FieldType<K extends FieldName> = K extends FieldName
  ? DefinitionOf<K>["type"] extends "boolean"
    ? boolean | FieldExtraChoice<K>
    : DefinitionOf<K>["type"] extends "string[]"
      ? string[]
      : string
  : never;

export type FormData = {
  [K in FieldName]: FieldType<K>;
};

export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];

export function shouldShowOtherPronouns(pronouns: unknown): boolean {
  return (
    pronouns === ALL || (Array.isArray(pronouns) && pronouns.includes("other"))
  );
}
