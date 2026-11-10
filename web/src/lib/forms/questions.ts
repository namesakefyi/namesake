import type { ComponentType } from "react";
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
import {
  type BooleanFieldName,
  type ExtraChoice,
  type FieldExtraChoice,
  type FieldName,
  type FieldValue,
  type FormData,
  type ListFieldName,
  type StringFieldName,
  shouldShowOtherPronouns,
  type TextFieldName,
} from "#constants/fields";

export type Data = Partial<FormData>;

export type Condition = (data: Data) => boolean;

export type Text = string | ((data: Data) => string);
export type OptionalText = string | ((data: Data) => string | undefined);

export type OptionLabel = string | { label: string; description?: string };

/** Labels for every allowed value of a field, each exactly once. */
export type Options<K extends FieldName> = {
  [V in FieldValue<K>]: OptionLabel;
};

export type OptionLabels = Readonly<Record<string, OptionLabel>>;

export function toChoices(options: OptionLabels) {
  return Object.entries(options).map(([value, option]) =>
    typeof option === "string"
      ? { value, label: option }
      : { value, label: option.label, description: option.description },
  );
}

export interface WrittenField<W extends FieldName = FieldName> {
  id: W;
  when?: Condition;
  /** Left off the review page while it has no answer. */
  optional?: boolean;
  reviewLabel?: Text;
  options?: OptionLabels;
}

/** Props of questions that write a single field, beyond its name. */
interface SingleFieldPropsByKind {
  shortText: { size?: number };
  longText: Record<never, never>;
  number: {
    minValue?: number;
    formatOptions?: Intl.NumberFormatOptions;
    defaultValue?: number;
  };
  memorableDate: Record<never, never>;
  checkbox: Record<never, never>;
  yesNo: {
    yesLabel?: string;
    noLabel?: string;
    extraChoices?: readonly ExtraChoice[];
  };
  radioGroup: { options: OptionLabels };
  checkboxGroup: { options: OptionLabels };
  comboBox: {
    options: readonly { label: string; value: string }[];
    placeholder?: string;
  };
  phone: Record<never, never>;
  email: Record<never, never>;
  languageSelect: Record<never, never>;
  repeatingEntry: {
    min: number;
    max?: number;
    itemLabel: string;
    size?: number;
  };
}

/** Each question's props, which its component receives as-is. */
export type FieldPropsByKind = {
  [K in keyof SingleFieldPropsByKind]: SingleFieldPropsByKind[K] & {
    name: K extends "checkboxGroup" | "repeatingEntry"
      ? ListFieldName
      : FieldName;
    description?: string;
  };
} & {
  name: { type: NameType };
  address: { type: AddressType; address2: boolean; county: boolean };
  pronounSelect: Record<never, never>;
};

export interface BlockPropsByKind {
  /** `content` is markdown. */
  banner: { content: Text; variant?: "info" | "success" | "warning" | "error" };
  subsection: { title?: OptionalText };
  costsTable: Record<never, never>;
  display: { component: ComponentType<any>; props?: object };
}

export type FieldKind = keyof FieldPropsByKind;
export type BlockKind = keyof BlockPropsByKind;

export interface CommonFieldOptions {
  when?: Condition;
  /** Defaults to the field's label. */
  reviewLabel?: Text;
}

export interface FieldQuestion<
  K extends FieldKind = FieldKind,
  W extends FieldName = FieldName,
> extends CommonFieldOptions {
  type: "field";
  kind: K;
  /** Set for nodes that write a single field. */
  name?: W;
  /** Undefined when the nearest title stands in as a hidden label. */
  label?: Text;
  writes: readonly WrittenField<W>[];
  props: FieldPropsByKind[K];
}

export type AnyFieldQuestion = {
  [K in FieldKind]: FieldQuestion<K>;
}[FieldKind];

export interface BlockQuestion<K extends BlockKind = BlockKind> {
  type: "block";
  kind: K;
  props: BlockPropsByKind[K];
  when?: Condition;
}

export interface SubsectionQuestion extends BlockQuestion<"subsection"> {
  children: readonly Question[];
}

export type Question =
  | AnyFieldQuestion
  | {
      [K in Exclude<BlockKind, "subsection">]: BlockQuestion<K>;
    }[Exclude<BlockKind, "subsection">]
  | SubsectionQuestion;

export type QuestionKind = FieldKind | BlockKind;

interface LabelOptions extends CommonFieldOptions {
  /** Omit for the single question under a title, which becomes its label. */
  label?: Text;
  description?: string;
}

type SingleFieldOptions<K extends keyof SingleFieldPropsByKind> = LabelOptions &
  SingleFieldPropsByKind[K];

type AddressOptions<T extends AddressType> = CommonFieldOptions &
  (T extends ExtendedAddressType
    ? { address2?: boolean; county?: boolean }
    : { address2?: never; county?: never });

/** `props` is required when the component has required props. */
type DisplayArguments<P> =
  Record<never, never> extends P
    ? [options?: { props?: P }]
    : [options: { props: P }];

/** `options` labels the stored values on the review page. */
function singleField<
  K extends keyof SingleFieldPropsByKind,
  W extends FieldName,
>(
  kind: K,
  name: W,
  { label, description, when, reviewLabel, ...props }: SingleFieldOptions<K>,
  options?: OptionLabels,
): FieldQuestion<K, W> {
  return {
    type: "field",
    kind,
    name,
    label,
    when,
    reviewLabel,
    writes: [{ id: name, options }],
    props: { ...props, name, description } as FieldPropsByKind[K],
  };
}

function composite<K extends FieldKind>(
  kind: K,
  writes: readonly WrittenField[],
  { when, reviewLabel }: CommonFieldOptions,
  props: FieldPropsByKind[K],
): FieldQuestion<K> {
  return { type: "field", kind, when, reviewLabel, writes, props };
}

/**
 * Builders for everything in a step's `body`. Each is named after its
 * component with the `Field` or `Form` affix dropped: `YesNoField` →
 * `q.yesNo`, `FormSubsection` → `q.subsection`.
 */
export const q = {
  shortText<W extends TextFieldName>(
    name: W,
    options: SingleFieldOptions<"shortText"> = {},
  ) {
    return singleField("shortText", name, options);
  },

  longText<W extends TextFieldName>(
    name: W,
    options: SingleFieldOptions<"longText"> = {},
  ) {
    return singleField("longText", name, options);
  },

  /** Stored as a string. */
  number<W extends StringFieldName>(
    name: W,
    options: SingleFieldOptions<"number"> = {},
  ) {
    return singleField("number", name, options);
  },

  memorableDate<W extends StringFieldName>(
    name: W,
    options: SingleFieldOptions<"memorableDate"> = {},
  ) {
    return singleField("memorableDate", name, options);
  },

  checkbox<W extends BooleanFieldName>(
    name: W,
    options: CommonFieldOptions & { label: Text },
  ) {
    return singleField("checkbox", name, options);
  },

  /** `extraChoices` must be declared on the field in `FIELD_DEFS`. */
  yesNo<W extends BooleanFieldName>(
    name: W,
    options: Omit<SingleFieldOptions<"yesNo">, "extraChoices"> & {
      extraChoices?: readonly FieldExtraChoice<W>[];
    } = {},
  ) {
    return singleField("yesNo", name, options);
  },

  radioGroup<W extends StringFieldName>(
    name: W,
    options: Omit<SingleFieldOptions<"radioGroup">, "options"> & {
      options: Options<W>;
    },
  ) {
    return singleField("radioGroup", name, options, options.options);
  },

  checkboxGroup<W extends ListFieldName>(
    name: W,
    options: SingleFieldOptions<"checkboxGroup">,
  ) {
    return singleField("checkboxGroup", name, options, options.options);
  },

  comboBox<W extends StringFieldName>(
    name: W,
    options: SingleFieldOptions<"comboBox">,
  ) {
    return singleField("comboBox", name, options);
  },

  phone<W extends StringFieldName>(name: W, options: LabelOptions = {}) {
    return singleField("phone", name, {
      ...options,
      label: options.label ?? "Phone number",
    });
  },

  email<W extends StringFieldName>(name: W, options: LabelOptions = {}) {
    return singleField("email", name, {
      ...options,
      label: options.label ?? "Email address",
    });
  },

  languageSelect<W extends StringFieldName>(
    name: W,
    options: CommonFieldOptions = {},
  ) {
    return singleField("languageSelect", name, {
      ...options,
      label: "Language",
    });
  },

  name(type: NameType, options: CommonFieldOptions = {}) {
    const names = NAME_FIELDS[type];
    const writes = (Object.keys(names) as NamePart[]).map((part) => ({
      id: names[part],
      reviewLabel: NAME_REVIEW_LABELS[type](part),
    }));
    return composite("name", writes, options, { type });
  },

  address<T extends AddressType>(type: T, options?: AddressOptions<T>) {
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
      const id = names[part];
      return id
        ? [
            {
              id,
              reviewLabel: getAddressReviewLabel(type, part),
              optional: part === "street2",
            },
          ]
        : [];
    });
    return composite("address", writes, common, { type, address2, county });
  },

  pronounSelect(options: CommonFieldOptions = {}) {
    return composite(
      "pronounSelect",
      [
        { id: "pronouns", reviewLabel: "Pronouns" },
        {
          id: "otherPronouns",
          reviewLabel: "Other pronouns",
          when: (data) => shouldShowOtherPronouns(data.pronouns),
        },
      ],
      options,
      {},
    );
  },

  /** Each entry is labeled `itemLabel` and its position, like "Address 2". */
  repeatingEntry<W extends ListFieldName>(
    name: W,
    options: SingleFieldOptions<"repeatingEntry">,
  ) {
    return singleField("repeatingEntry", name, options);
  },

  /** `content` is markdown. */
  banner(
    content: Text,
    {
      when,
      ...props
    }: Omit<BlockPropsByKind["banner"], "content"> & { when?: Condition } = {},
  ): BlockQuestion<"banner"> {
    return {
      type: "block",
      kind: "banner",
      when,
      props: { content, ...props },
    };
  },

  costsTable(options?: { when?: Condition }): BlockQuestion<"costsTable"> {
    return { type: "block", kind: "costsTable", props: {}, ...options };
  },

  subsection(
    children: readonly Question[],
    { when, title }: { title?: OptionalText; when?: Condition } = {},
  ): SubsectionQuestion {
    return {
      type: "block",
      kind: "subsection",
      children,
      when,
      props: { title },
    };
  },

  /** A component that writes no data. */
  display<P extends object>(
    component: ComponentType<P>,
    ...[options]: DisplayArguments<P>
  ): BlockQuestion<"display"> {
    return {
      type: "block",
      kind: "display",
      props: { component, props: options?.props },
    };
  },
};
