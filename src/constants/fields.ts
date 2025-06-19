export const FIELD_DEFS = [
  { name: "oldFirstName", label: "Old first name", type: "string" },
  { name: "oldMiddleName", label: "Old middle name", type: "string" },
  { name: "oldLastName", label: "Old last name", type: "string" },
  { name: "newFirstName", label: "New first name", type: "string" },
  { name: "newMiddleName", label: "New middle name", type: "string" },
  { name: "newLastName", label: "New last name", type: "string" },
  {
    name: "reasonForChangingName",
    label: "Reason for changing name",
    type: "string",
  },
  { name: "phoneNumber", label: "Phone number", type: "string" },
  { name: "email", label: "Email", type: "string" },
  { name: "dateOfBirth", label: "Date of birth", type: "string" },
  { name: "birthplaceCity", label: "City of birth", type: "string" },
  { name: "birthplaceState", label: "State of birth", type: "string" },
  { name: "birthplaceCountry", label: "Country of birth", type: "string" },
  {
    name: "isCurrentlyUnhoused",
    label: "Currently unhoused?",
    type: "boolean",
  },
  {
    name: "residenceStreetAddress",
    label: "Residence street address",
    type: "string",
  },
  { name: "residenceCity", label: "Residence city", type: "string" },
  { name: "residenceCounty", label: "Residence county", type: "string" },
  { name: "residenceState", label: "Residence state", type: "string" },
  { name: "residenceZipCode", label: "Residence zip code", type: "string" },
  {
    name: "isMailingAddressDifferentFromResidence",
    label: "Mailing address different from residence?",
    type: "boolean",
  },
  {
    name: "mailingStreetAddress",
    label: "Mailing street address",
    type: "string",
  },
  { name: "mailingCity", label: "Mailing city", type: "string" },
  { name: "mailingCounty", label: "Mailing county", type: "string" },
  { name: "mailingState", label: "Mailing state", type: "string" },
  { name: "mailingZipCode", label: "Mailing zip code", type: "string" },
  {
    name: "hasPreviousNameChange",
    label: "Has previous name change?",
    type: "boolean",
  },
  { name: "previousNameFrom", label: "Previous name from", type: "string" },
  { name: "previousNameTo", label: "Previous name to", type: "string" },
  { name: "previousNameReason", label: "Previous name reason", type: "string" },
  {
    name: "hasUsedOtherNameOrAlias",
    label: "Has used other name or alias?",
    type: "boolean",
  },
  {
    name: "otherNamesOrAliases",
    label: "Other names or aliases",
    type: "string",
  },
  { name: "previousLegalNames", label: "Previous legal names", type: "string" },
  {
    name: "isInterpreterNeeded",
    label: "Interpreter needed?",
    type: "boolean",
  },
  { name: "language", label: "Language", type: "string" },
  {
    name: "isOkayToSharePronouns",
    label: "Okay to share pronouns?",
    type: "boolean",
  },
  { name: "pronouns", label: "Pronouns", type: "string[]" },
  { name: "otherPronouns", label: "Other pronouns", type: "string" },
  {
    name: "shouldReturnOriginalDocuments",
    label: "Return original documents?",
    type: "boolean",
  },
  {
    name: "shouldWaivePublicationRequirement",
    label: "Waive publication requirement?",
    type: "boolean",
  },
  {
    name: "reasonToWaivePublication",
    label: "Reason to waive publication",
    type: "string",
  },
  {
    name: "shouldImpoundCourtRecords",
    label: "Impound court records?",
    type: "boolean",
  },
  {
    name: "reasonToImpoundCourtRecords",
    label: "Reason to impound court records",
    type: "string",
  },
  {
    name: "shouldApplyForFeeWaiver",
    label: "Apply for a fee waiver?",
    type: "boolean",
  },
  { name: "mothersMaidenName", label: "Mother's maiden name", type: "string" },
  {
    name: "citizenshipStatus",
    label: "Citizenship status",
    type: "string",
  },
  {
    name: "sexAssignedAtBirth",
    label: "Sex assigned at birth",
    type: "string",
  },
  {
    name: "isHispanicOrLatino",
    label: "Hispanic or Latino?",
    type: "boolean",
  },
  {
    name: "race",
    label: "Race",
    type: "string[]",
  },
  {
    name: "mothersFirstName",
    label: "Mother's first name",
    type: "string",
  },
  {
    name: "mothersMiddleName",
    label: "Mother's middle name",
    type: "string",
  },
  {
    name: "mothersLastName",
    label: "Mother's last name",
    type: "string",
  },
  {
    name: "fathersFirstName",
    label: "Father's first name",
    type: "string",
  },
  {
    name: "fathersMiddleName",
    label: "Father's middle name",
    type: "string",
  },
  {
    name: "fathersLastName",
    label: "Father's last name",
    type: "string",
  },
  {
    name: "hasPreviousSocialSecurityCard",
    label: "Previous Social Security card?",
    type: "boolean",
  },
  {
    name: "previousSocialSecurityCardFirstName",
    label: "First name on previous Social Security card",
    type: "string",
  },
  {
    name: "previousSocialSecurityCardMiddleName",
    label: "Middle name on previous Social Security card",
    type: "string",
  },
  {
    name: "previousSocialSecurityCardLastName",
    label: "Last name on previous Social Security card",
    type: "string",
  },
  {
    name: "isFilingForSomeoneElse",
    label: "Are you filing this form for someone else?",
    type: "boolean",
  },
  {
    name: "relationshipToFilingFor",
    label: "Relationship to the person you are filing for",
    type: "string",
  },
  {
    name: "relationshipToFilingForOther",
    label: "Relationship to the person you are filing for (other)",
    type: "string",
  },
] as const;

export type FieldName = (typeof FIELD_DEFS)[number]["name"];

// Map the string type to actual TS types
export type FieldType<K extends FieldName> = K extends any
  ? Extract<(typeof FIELD_DEFS)[number], { name: K }>["type"] extends "string"
    ? string
    : Extract<
          (typeof FIELD_DEFS)[number],
          { name: K }
        >["type"] extends "boolean"
      ? boolean
      : Extract<
            (typeof FIELD_DEFS)[number],
            { name: K }
          >["type"] extends "string[]"
        ? string[]
        : never
  : never;

export type FormData = {
  [K in FieldName]: FieldType<K>;
};

export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];

export const PREFER_NOT_TO_ANSWER = "preferNotToAnswer";
