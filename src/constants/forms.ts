export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];

type FieldDefinition = {
  label: string;
  type: "boolean" | "string" | "string[]";
};

export const USER_FORM_DATA_FIELDS: Record<string, FieldDefinition> = {
  oldFirstName: {
    label: "Old first name",
    type: "string",
  },
  oldMiddleName: {
    label: "Old middle name",
    type: "string",
  },
  oldLastName: {
    label: "Old last name",
    type: "string",
  },
  newFirstName: {
    label: "New first name",
    type: "string",
  },
  newMiddleName: {
    label: "New middle name",
    type: "string",
  },
  newLastName: {
    label: "New last name",
    type: "string",
  },
  reasonForChangingName: {
    label: "Reason for changing name",
    type: "string",
  },
  phoneNumber: {
    label: "Phone number",
    type: "string",
  },
  email: {
    label: "Email",
    type: "string",
  },
  dateOfBirth: {
    label: "Date of birth",
    type: "string",
  },
  isCurrentlyUnhoused: {
    label: "Currently unhoused?",
    type: "boolean",
  },
  residenceStreetAddress: {
    label: "Residence street address",
    type: "string",
  },
  residenceCity: {
    label: "Residence city",
    type: "string",
  },
  residenceCounty: {
    label: "Residence county",
    type: "string",
  },
  residenceState: {
    label: "Residence state",
    type: "string",
  },
  residenceZipCode: {
    label: "Residence zip code",
    type: "string",
  },
  isMailingAddressDifferentFromResidence: {
    label: "Mailing address different from residence?",
    type: "boolean",
  },
  mailingStreetAddress: {
    label: "Mailing street address",
    type: "string",
  },
  mailingCity: {
    label: "Mailing city",
    type: "string",
  },
  mailingCounty: {
    label: "Mailing county",
    type: "string",
  },
  mailingState: {
    label: "Mailing state",
    type: "string",
  },
  mailingZipCode: {
    label: "Mailing zip code",
    type: "string",
  },
  hasPreviousNameChange: {
    label: "Has previous name change?",
    type: "boolean",
  },
  previousLegalNames: {
    label: "Previous legal names",
    type: "string",
  },
  isInterpreterNeeded: {
    label: "Interpreter needed?",
    type: "boolean",
  },
  language: {
    label: "Language",
    type: "string",
  },
  isOkayToSharePronouns: {
    label: "Okay to share pronouns?",
    type: "boolean",
  },
  pronouns: {
    label: "Pronouns",
    type: "string[]",
  },
  otherPronouns: {
    label: "Other pronouns",
    type: "string",
  },
  shouldReturnOriginalDocuments: {
    label: "Return original documents?",
    type: "boolean",
  },
  shouldWaivePublicationRequirement: {
    label: "Waive publication requirement?",
    type: "boolean",
  },
  shouldImpoundCourtRecords: {
    label: "Impound court records?",
    type: "boolean",
  },
  shouldApplyForFeeWaiver: {
    label: "Apply for a fee waiver?",
    type: "boolean",
  },
  mothersMaidenName: {
    label: "Mother's maiden name",
    type: "string",
  },
} as const;

export type UserFormDataField = keyof typeof USER_FORM_DATA_FIELDS;

export type FieldType<K extends UserFormDataField> = {
  boolean: boolean;
  "string[]": string[];
  string: string;
}[(typeof USER_FORM_DATA_FIELDS)[K]["type"]];
