import type { FieldName } from "#constants/fields";

const nameFields = <P extends string>(prefix: P) =>
  ({
    first: `${prefix}FirstName`,
    middle: `${prefix}MiddleName`,
    last: `${prefix}LastName`,
  }) as const;

export const NAME_FIELDS = {
  newName: nameFields("new"),
  oldName: nameFields("old"),
  mothersName: nameFields("mothers"),
  fathersName: nameFields("fathers"),
  previousSocialSecurityCardName: nameFields("previousSocialSecurityCard"),
  parent1Name: nameFields("parent1"),
  parent2Name: nameFields("parent2"),
  guardianName: nameFields("guardian"),
  coGuardianName: nameFields("coGuardian"),
} satisfies Record<
  string,
  { first: FieldName; middle: FieldName; last: FieldName }
>;

export type NameType = keyof typeof NAME_FIELDS;
export type NamePart = keyof (typeof NAME_FIELDS)[NameType];

const NAME_PART_LABELS: Record<NamePart, string> = {
  first: "first name",
  middle: "middle name",
  last: "last name",
};

export const NAME_REVIEW_LABELS: Record<NameType, (part: NamePart) => string> =
  {
    newName: (part) => `New ${NAME_PART_LABELS[part]}`,
    oldName: (part) => `Old ${NAME_PART_LABELS[part]}`,
    mothersName: (part) => `Mother's ${NAME_PART_LABELS[part]}`,
    fathersName: (part) => `Father's ${NAME_PART_LABELS[part]}`,
    previousSocialSecurityCardName: (part) =>
      `${NAME_PART_LABELS[part].replace(/^./, (letter) => letter.toUpperCase())} on previous Social Security card`,
    parent1Name: (part) => `Parent 1 ${NAME_PART_LABELS[part]}`,
    parent2Name: (part) => `Parent 2 ${NAME_PART_LABELS[part]}`,
    guardianName: (part) => `Guardian ${NAME_PART_LABELS[part]}`,
    coGuardianName: (part) => `Co-guardian ${NAME_PART_LABELS[part]}`,
  };

export interface AddressNames {
  street: FieldName;
  street2?: FieldName;
  city: FieldName;
  state: FieldName;
  zip: FieldName;
  county?: FieldName;
}

/** An address stored as `${prefix}StreetAddress`, `${prefix}City` and so on. */
const addressFields = <P extends string>(prefix: P) =>
  ({
    street: `${prefix}StreetAddress`,
    city: `${prefix}City`,
    state: `${prefix}State`,
    zip: `${prefix}ZipCode`,
  }) as const;

/** Adds the second address line and county. */
const extendedAddressFields = <P extends string>(prefix: P) =>
  ({
    ...addressFields(prefix),
    street2: `${prefix}StreetAddress2`,
    county: `${prefix}County`,
  }) as const;

export const ADDRESS_FIELDS = {
  residence: extendedAddressFields("residence"),
  mailing: extendedAddressFields("mailing"),
  parent1: addressFields("parent1"),
  parent2: addressFields("parent2"),
  guardian: addressFields("guardian"),
  coGuardian: addressFields("coGuardian"),
} satisfies Record<string, AddressNames>;

export type AddressType = keyof typeof ADDRESS_FIELDS;
export type AddressPart = keyof AddressNames;

/** Address types that can ask for a second address line and a county. */
export type ExtendedAddressType = {
  [T in AddressType]: "county" extends keyof (typeof ADDRESS_FIELDS)[T]
    ? T
    : never;
}[AddressType];

const ADDRESS_SUBJECTS: Record<AddressType, string> = {
  residence: "Residence",
  mailing: "Mailing",
  parent1: "Parent 1",
  parent2: "Parent 2",
  guardian: "Guardian",
  coGuardian: "Co-guardian",
};

const ADDRESS_PART_LABELS: Record<Exclude<AddressPart, "street2">, string> = {
  street: "street address",
  city: "city",
  state: "state",
  zip: "zip code",
  county: "county",
};

export function getAddressReviewLabel(
  type: AddressType,
  part: AddressPart,
): string {
  if (part === "street2") return "Apartment, suite, unit, etc.";
  return `${ADDRESS_SUBJECTS[type]} ${ADDRESS_PART_LABELS[part]}`;
}
