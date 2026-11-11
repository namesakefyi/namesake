import { ALL } from "./all.ts";
import {
  ADDRESS_FIELDS,
  type AddressFieldName,
  type AddressPart,
  type AddressType,
  NAME_FIELDS,
  type NameFieldName,
} from "./fieldGroups.ts";
import type { JurisdictionId } from "./jurisdictions.ts";

export const PREFER_NOT_TO_ANSWER = "preferNotToAnswer";
export const DONT_KNOW = "dontKnow";

export type ExtraChoice = typeof PREFER_NOT_TO_ANSWER | typeof DONT_KNOW;

/** How an extra choice reads on the review page and in its input. */
export const EXTRA_CHOICE_LABELS: Readonly<Record<string, string>> = {
  [PREFER_NOT_TO_ANSWER]: "Prefer not to answer",
  [DONT_KNOW]: "I don’t know",
} satisfies Record<ExtraChoice, string>;

/** How a field is asked, which decides the questions that may ask it. */
export type FieldTypeName =
  | "text"
  | "date"
  | "phone"
  | "email"
  | "number"
  | "state"
  | "country"
  | "language"
  | "bool"
  | "oneOf"
  | "list";

export interface FieldType<
  T extends FieldTypeName = FieldTypeName,
  V = unknown,
> {
  type: T;
  /** Type-only: the stored value. */
  readonly value?: V;
}

const fieldType = <T extends FieldTypeName, V>(type: T) =>
  ({ type }) as FieldType<T, V>;

const text = fieldType<"text", string>("text");
const date = fieldType<"date", string>("date");
const phone = fieldType<"phone", string>("phone");
const email = fieldType<"email", string>("email");
const state = fieldType<"state", Uppercase<JurisdictionId>>("state");
const country = fieldType<"country", string>("country");
const language = fieldType<"language", string>("language");
const bool = fieldType<"bool", boolean>("bool");
const list = fieldType<"list", string[]>("list");
function oneOf<const V extends string>(...values: V[]) {
  return { type: "oneOf", values } as FieldType<"oneOf", V> & {
    values: readonly V[];
  };
}

/** Every name part is text, and every address part but the state. */
const GROUP_FIELDS = Object.fromEntries([
  ...Object.values(NAME_FIELDS).flatMap((parts) =>
    Object.values(parts).map((name) => [name, text]),
  ),
  ...Object.values(ADDRESS_FIELDS).flatMap((parts) =>
    Object.entries(parts).map(([part, name]) => [
      name,
      part === "state" ? state : text,
    ]),
  ),
]) as Record<
  NameFieldName | AddressFieldName<AddressType, Exclude<AddressPart, "state">>,
  typeof text
> &
  Record<AddressFieldName<AddressType, "state">, typeof state>;

/**
 * Common fields asked by more than one form.
 */
export const SHARED_FIELDS = {
  ...GROUP_FIELDS,
  dateOfBirth: date,
  phoneNumber: phone,
  email: email,
  birthplaceCity: text,
  birthplaceState: state,
  birthplaceCountry: country,
  language: language,
  pronouns: list,
  otherPronouns: text,
  isOkayToSharePronouns: bool,
  reasonForChangingName: text,
  isCurrentlyUnhoused: bool,
  isMailingAddressDifferentFromResidence: bool,
  hasPreviousNameChange: bool,
  previousNameFrom: text,
  previousNameTo: text,
  previousNameReason: text,
  hasUsedOtherNameOrAlias: bool,
  otherNamesOrAliases: text,
  newGender: oneOf("Female", "Male", "X"),
} satisfies Record<string, FieldType>;

type Registry = typeof SHARED_FIELDS;

export type SharedFieldName = keyof Registry;

export type SharedFields = {
  [K in SharedFieldName]: Registry[K] extends FieldType<FieldTypeName, infer V>
    ? V
    : never;
};

export function getSharedFieldType(name: string): FieldTypeName | undefined {
  return Object.hasOwn(SHARED_FIELDS, name)
    ? SHARED_FIELDS[name as SharedFieldName].type
    : undefined;
}

export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];

export function shouldShowOtherPronouns(pronouns: unknown): boolean {
  return (
    pronouns === ALL || (Array.isArray(pronouns) && pronouns.includes("other"))
  );
}
