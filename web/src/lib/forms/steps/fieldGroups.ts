import type { FieldName } from "#constants/fields";

/** The three fields written by each `NameField` type. */
export const NAME_FIELDS = {
  newName: {
    first: "newFirstName",
    middle: "newMiddleName",
    last: "newLastName",
  },
  oldName: {
    first: "oldFirstName",
    middle: "oldMiddleName",
    last: "oldLastName",
  },
  mothersName: {
    first: "mothersFirstName",
    middle: "mothersMiddleName",
    last: "mothersLastName",
  },
  fathersName: {
    first: "fathersFirstName",
    middle: "fathersMiddleName",
    last: "fathersLastName",
  },
  previousSocialSecurityCardName: {
    first: "previousSocialSecurityCardFirstName",
    middle: "previousSocialSecurityCardMiddleName",
    last: "previousSocialSecurityCardLastName",
  },
} as const satisfies Record<
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

/** How each name type is labeled in the review table. */
export const NAME_REVIEW_LABELS: Record<NameType, (part: NamePart) => string> =
  {
    newName: (part) => `New ${NAME_PART_LABELS[part]}`,
    oldName: (part) => `Old ${NAME_PART_LABELS[part]}`,
    mothersName: (part) => `Mother's ${NAME_PART_LABELS[part]}`,
    fathersName: (part) => `Father's ${NAME_PART_LABELS[part]}`,
    previousSocialSecurityCardName: (part) =>
      `${NAME_PART_LABELS[part].replace(/^./, (letter) => letter.toUpperCase())} on previous Social Security card`,
  };

/** The fields one address writes; `street2` and `county` are optional. */
export interface AddressNames {
  street: FieldName;
  street2?: FieldName;
  city: FieldName;
  state: FieldName;
  zip: FieldName;
  county?: FieldName;
}

/** The fields written by each `AddressField` type. */
export const ADDRESS_FIELDS = {
  residence: {
    street: "residenceStreetAddress",
    street2: "residenceStreetAddress2",
    city: "residenceCity",
    state: "residenceState",
    zip: "residenceZipCode",
    county: "residenceCounty",
  },
  mailing: {
    street: "mailingStreetAddress",
    street2: "mailingStreetAddress2",
    city: "mailingCity",
    state: "mailingState",
    zip: "mailingZipCode",
    county: "mailingCounty",
  },
  parent1: {
    street: "parent1StreetAddress",
    city: "parent1City",
    state: "parent1State",
    zip: "parent1ZipCode",
  },
  parent2: {
    street: "parent2StreetAddress",
    city: "parent2City",
    state: "parent2State",
    zip: "parent2ZipCode",
  },
} as const satisfies Record<string, AddressNames>;

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
};

const ADDRESS_PART_LABELS: Record<Exclude<AddressPart, "street2">, string> = {
  street: "street address",
  city: "city",
  state: "state",
  zip: "zip code",
  county: "county",
};

/** How an address field is labeled in the review table. */
export function getAddressReviewLabel(
  type: AddressType,
  part: AddressPart,
): string {
  if (part === "street2") return "Apartment, suite, unit, etc.";
  return `${ADDRESS_SUBJECTS[type]} ${ADDRESS_PART_LABELS[part]}`;
}
