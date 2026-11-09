import {
  ADDRESS_FIELDS,
  type AddressPart,
  type AddressType,
  type ExtendedAddressType,
  getAddressReviewLabel,
  NAME_FIELDS,
  NAME_REVIEW_LABELS,
  type NamePart,
  type NameType,
} from "#constants/fieldGroups";
import { type FieldName, shouldShowOtherPronouns } from "#constants/fields";
import { withDeps } from "./conditions";
import type {
  BooleanFieldName,
  CommonFieldOptions,
  FieldKind,
  FieldNode,
  FieldPropsByKind,
  ListFieldName,
  OptionLabels,
  Options,
  StringFieldName,
  Text,
  TextFieldName,
  WrittenField,
} from "./types";

interface LabelOptions extends CommonFieldOptions {
  /** Omit for a step's single question: the step title becomes the label. */
  label?: Text;
  /** Help text shown with the input. */
  description?: string;
}

/** A builder's settings: the shared ones plus its kind's own props. */
type SingleFieldOptions<K extends FieldKind> = LabelOptions &
  FieldPropsByKind[K];

function singleField<K extends FieldKind, W extends FieldName>(
  kind: K,
  name: W,
  {
    label,
    description,
    when,
    reviewLabel,
    render,
    ...props
  }: SingleFieldOptions<K>,
): FieldNode<K, W> {
  const options =
    "options" in props ? (props.options as OptionLabels) : undefined;
  return {
    type: "field",
    kind,
    name,
    label,
    description,
    when,
    reviewLabel,
    render,
    writes: [{ id: name, options }],
    props: props as unknown as FieldPropsByKind[K],
  };
}

function composite<K extends FieldKind, W extends FieldName>(
  kind: K,
  writes: readonly WrittenField<W>[],
  { when, reviewLabel, render }: CommonFieldOptions,
  props: FieldPropsByKind[K],
): FieldNode<K, W> {
  return { type: "field", kind, when, reviewLabel, render, writes, props };
}

/** Builders for nodes that write data, one per form field component. */
export const field = {
  /** `ShortTextField`: a single line of text. */
  shortText<W extends TextFieldName>(
    name: W,
    options: SingleFieldOptions<"field.shortText"> = {},
  ) {
    return singleField("field.shortText", name, options);
  },

  /** `LongTextField`: a paragraph of text. */
  longText<W extends TextFieldName>(
    name: W,
    options: SingleFieldOptions<"field.longText"> = {},
  ) {
    return singleField("field.longText", name, options);
  },

  /** `NumberField`: a number, stored as a string. */
  number<W extends StringFieldName>(
    name: W,
    options: SingleFieldOptions<"field.number"> = {},
  ) {
    return singleField("field.number", name, options);
  },

  /** `MemorableDateField`: a date someone knows by heart. */
  memorableDate<W extends StringFieldName>(
    name: W,
    options: SingleFieldOptions<"field.memorableDate"> = {},
  ) {
    return singleField("field.memorableDate", name, options);
  },

  /** `CheckboxField`: a single checkbox. */
  checkbox<W extends BooleanFieldName>(
    name: W,
    options: CommonFieldOptions & { label: Text },
  ) {
    return singleField("field.checkbox", name, options);
  },

  /** `YesNoField`: a yes or no question. */
  yesNo<W extends BooleanFieldName>(
    name: W,
    options: SingleFieldOptions<"field.yesNo"> = {},
  ) {
    return singleField("field.yesNo", name, options);
  },

  /** `RadioGroupField`: one choice from a list. */
  radioGroup<W extends StringFieldName>(
    name: W,
    options: Omit<SingleFieldOptions<"field.radioGroup">, "options"> & {
      options: Options<W>;
    },
  ) {
    return singleField("field.radioGroup", name, options);
  },

  /** `CheckboxGroupField`: any number of choices from a list. */
  checkboxGroup<W extends ListFieldName>(
    name: W,
    options: SingleFieldOptions<"field.checkboxGroup">,
  ) {
    return singleField("field.checkboxGroup", name, options);
  },

  /** `ComboBoxField`: one choice from a long, searchable list. */
  comboBox<W extends StringFieldName>(
    name: W,
    options: SingleFieldOptions<"field.comboBox">,
  ) {
    return singleField("field.comboBox", name, options);
  },

  /** `PhoneField`: labeled "Phone number" unless `label` is given. */
  phone<W extends StringFieldName>(name: W, options: LabelOptions = {}) {
    return singleField("field.phone", name, {
      ...options,
      label: options.label ?? "Phone number",
    });
  },

  /** `EmailField`: labeled "Email address" unless `label` is given. */
  email<W extends StringFieldName>(name: W, options: LabelOptions = {}) {
    return singleField("field.email", name, {
      ...options,
      label: options.label ?? "Email address",
    });
  },

  /** `LanguageSelectField`: labeled "Language". */
  languageSelect<W extends StringFieldName>(
    name: W,
    options: CommonFieldOptions = {},
  ) {
    return singleField("field.languageSelect", name, {
      ...options,
      label: "Language",
    });
  },

  /** `NameField`: first, middle and last name. */
  name<T extends NameType>(type: T, options: CommonFieldOptions = {}) {
    const names = NAME_FIELDS[type];
    const writes = (Object.keys(names) as NamePart[]).map((part) => ({
      id: names[part] as (typeof NAME_FIELDS)[T][NamePart],
      reviewLabel: NAME_REVIEW_LABELS[type](part),
    }));
    return composite("field.name", writes, options, { type });
  },

  /** `AddressField`: street, city, state and ZIP, plus optional parts. */
  address<
    T extends AddressType,
    const O extends AddressOptions<T> = Record<never, never>,
  >(type: T, options?: O & AddressOptions<T>) {
    const {
      address2 = false,
      county = false,
      ...common
    } = (options ?? {}) as AddressOptions<ExtendedAddressType>;
    const names: Partial<Record<AddressPart, FieldName>> = ADDRESS_FIELDS[type];
    const parts: AddressPart[] = [
      "street",
      ...(address2 ? (["street2"] as const) : []),
      "city",
      ...(county ? (["county"] as const) : []),
      "state",
      "zip",
    ];
    const writes = parts.flatMap((part) => {
      const id = names[part] as
        | Extract<AddressWrites<T, O>, FieldName>
        | undefined;
      return id ? [{ id, reviewLabel: getAddressReviewLabel(type, part) }] : [];
    });
    return composite("field.address", writes, common, {
      type,
      address2,
      county,
    });
  },

  /** `PronounSelectField`: pronouns, plus free text for "other". */
  pronounSelect(options: CommonFieldOptions = {}) {
    const writes: WrittenField<"pronouns" | "otherPronouns">[] = [
      { id: "pronouns", reviewLabel: "Pronouns" },
      {
        id: "otherPronouns",
        reviewLabel: "Other pronouns",
        when: withDeps(
          (data) => shouldShowOtherPronouns(data.pronouns),
          ["pronouns"],
        ),
      },
    ];
    return composite("field.pronounSelect", writes, options, {});
  },

  /**
   * `RepeatingEntry`: a list of short answers. Each entry is labeled with
   * `itemLabel` and its position, like "Address 2".
   */
  repeatingEntry<W extends ListFieldName>(
    name: W,
    options: SingleFieldOptions<"field.repeatingEntry">,
  ) {
    return singleField("field.repeatingEntry", name, options);
  },
};

/** Settings for `field.address`; only residence and mailing take flags. */
export type AddressOptions<T extends AddressType> = CommonFieldOptions &
  (T extends ExtendedAddressType
    ? { address2?: boolean; county?: boolean }
    : { address2?: never; county?: never });

/** The field an address type writes for `part`, if it has one. */
type AddressPartField<
  T extends AddressType,
  P extends AddressPart,
> = (typeof ADDRESS_FIELDS)[T][Extract<keyof (typeof ADDRESS_FIELDS)[T], P>];

/** Fields written by `field.address(type, options)`. */
export type AddressWrites<T extends AddressType, O> =
  | AddressPartField<T, "street" | "city" | "state" | "zip">
  | (O extends { address2: true } ? AddressPartField<T, "street2"> : never)
  | (O extends { county: true } ? AddressPartField<T, "county"> : never);
