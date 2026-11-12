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

/**
 * Answers a question may offer beyond its own options, with how each reads on
 * the review page and in its input.
 */
export const EXTRA_CHOICES = {
  preferNotToAnswer: "Prefer not to answer",
  dontKnow: "I don’t know",
} as const;

export type ExtraChoice = keyof typeof EXTRA_CHOICES;

export const isExtraChoice = (value: unknown): value is ExtraChoice =>
  typeof value === "string" && Object.hasOwn(EXTRA_CHOICES, value);

/** How a field's answer is stored, which decides the questions that may ask it. */
export type FieldType =
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

export interface FieldDefinition<T extends FieldType = FieldType, V = unknown> {
  type: T;
  /** Type-only: the stored value. */
  readonly value?: V;
}

const fieldDefinition = <T extends FieldType, V>(type: T) =>
  ({ type }) as FieldDefinition<T, V>;

const text = fieldDefinition<"text", string>("text");
const date = fieldDefinition<"date", string>("date");
const phone = fieldDefinition<"phone", string>("phone");
const email = fieldDefinition<"email", string>("email");
const state = fieldDefinition<"state", Uppercase<JurisdictionId>>("state");
const country = fieldDefinition<"country", string>("country");
const language = fieldDefinition<"language", string>("language");
const bool = fieldDefinition<"bool", boolean>("bool");
const list = fieldDefinition<"list", string[]>("list");
function oneOf<const V extends string>(...values: V[]) {
  return { type: "oneOf", values } as FieldDefinition<"oneOf", V> & {
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
} satisfies Record<string, FieldDefinition>;

type Registry = typeof SHARED_FIELDS;

export type SharedFieldName = keyof Registry;

export type SharedFields = {
  [K in SharedFieldName]: Registry[K] extends FieldDefinition<
    FieldType,
    infer V
  >
    ? V
    : never;
};

export function getSharedFieldType(name: string): FieldType | undefined {
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
