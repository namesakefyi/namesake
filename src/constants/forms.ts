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
    name: "shouldImpoundCourtRecords",
    label: "Impound court records?",
    type: "boolean",
  },
  {
    name: "shouldApplyForFeeWaiver",
    label: "Apply for a fee waiver?",
    type: "boolean",
  },
  { name: "mothersMaidenName", label: "Mother's maiden name", type: "string" },
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

// Helper type to get the type for a given field name
export type FieldTypeForField<N extends FieldName> = FieldType<N>;

export type FormData = {
  [K in FieldName]: FieldTypeForField<K>;
};

export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];
