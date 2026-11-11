import type { ComponentType } from "react";
import { COUNTRY_OPTIONS } from "#constants/countries";
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
  type ExtraChoice,
  type FieldTypeName,
  getSharedFieldType,
  type SharedFields,
  shouldShowOtherPronouns,
} from "#constants/fields";
import { JURISDICTION_OPTIONS } from "#constants/jurisdictions";

export type FieldValue = string | boolean | string[];

/**
 * A form's saved fields. Shared fields are typed by the registry; the
 * integrity tests check every other field a form reads.
 */
export type FormData = Partial<SharedFields> & {
  readonly [name: string]: FieldValue | undefined;
};

export type Condition = (data: FormData) => boolean;

export type Text = string | ((data: FormData) => string);
export type OptionalText = string | ((data: FormData) => string | undefined);

export type OptionLabel = string | { label: string; description?: string };

export type OptionLabels = Readonly<Record<string, OptionLabel>>;

export function toChoices(options: OptionLabels) {
  return Object.entries(options).map(([value, option]) =>
    typeof option === "string"
      ? { value, label: option }
      : { value, label: option.label, description: option.description },
  );
}

export interface WrittenField {
  id: string;
  type: FieldTypeName;
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
    name: string;
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

export interface FieldQuestion<K extends FieldKind = FieldKind>
  extends CommonFieldOptions {
  type: "field";
  kind: K;
  /** Set for nodes that write a single field. */
  name?: string;
  /** Undefined when the nearest title stands in as a hidden label. */
  label?: Text;
  writes: readonly WrittenField[];
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
function singleField<K extends keyof SingleFieldPropsByKind>(
  kind: K,
  type: FieldTypeName,
  name: string,
  { label, description, when, reviewLabel, ...props }: SingleFieldOptions<K>,
  options?: OptionLabels,
): FieldQuestion<K> {
  return {
    type: "field",
    kind,
    name,
    label,
    when,
    reviewLabel,
    writes: [{ id: name, type, options }],
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

const SHARED_COMBO_BOX_OPTIONS = {
  state: JURISDICTION_OPTIONS,
  country: COUNTRY_OPTIONS,
};

/**
 * Builders for everything in a step's `body`. Each is named after its
 * component with the `Field` or `Form` affix dropped: `YesNoField` →
 * `q.yesNo`, `FormSubsection` → `q.subsection`.

 */
export const q = {
  shortText(name: string, options: SingleFieldOptions<"shortText"> = {}) {
    return singleField("shortText", "text", name, options);
  },

  longText(name: string, options: SingleFieldOptions<"longText"> = {}) {
    return singleField("longText", "text", name, options);
  },

  /** Stored as a string. */
  number(name: string, options: SingleFieldOptions<"number"> = {}) {
    return singleField("number", "number", name, options);
  },

  memorableDate(
    name: string,
    options: SingleFieldOptions<"memorableDate"> = {},
  ) {
    return singleField("memorableDate", "date", name, options);
  },

  checkbox(name: string, options: CommonFieldOptions & { label: Text }) {
    return singleField("checkbox", "bool", name, options);
  },

  /** `extraChoices` are stored as themselves, besides yes and no. */
  yesNo(name: string, options: SingleFieldOptions<"yesNo"> = {}) {
    return singleField("yesNo", "bool", name, options);
  },

  radioGroup(name: string, options: SingleFieldOptions<"radioGroup">) {
    return singleField("radioGroup", "oneOf", name, options, options.options);
  },

  checkboxGroup(name: string, options: SingleFieldOptions<"checkboxGroup">) {
    return singleField("checkboxGroup", "list", name, options, options.options);
  },

  /** Shared state and country fields come with their options. */
  comboBox(
    name: string,
    options: Omit<SingleFieldOptions<"comboBox">, "options"> &
      Partial<Pick<SingleFieldOptions<"comboBox">, "options">>,
  ) {
    const type = getSharedFieldType(name) ?? "text";
    const choices =
      options.options ??
      SHARED_COMBO_BOX_OPTIONS[type as keyof typeof SHARED_COMBO_BOX_OPTIONS];
    if (!choices) throw new Error(`Combo box "${name}" needs options.`);
    return singleField("comboBox", type, name, {
      ...options,
      options: choices,
    });
  },

  phone(name: string, options: LabelOptions = {}) {
    return singleField("phone", "phone", name, {
      ...options,
      label: options.label ?? "Phone number",
    });
  },

  email(name: string, options: LabelOptions = {}) {
    return singleField("email", "email", name, {
      ...options,
      label: options.label ?? "Email address",
    });
  },

  languageSelect(name: string, options: CommonFieldOptions = {}) {
    return singleField("languageSelect", "language", name, {
      ...options,
      label: "Language",
    });
  },

  name(type: NameType, options: CommonFieldOptions = {}) {
    const names = NAME_FIELDS[type];
    const writes = (Object.keys(names) as NamePart[]).map((part) => ({
      id: names[part],
      type: "text" as const,
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
    const names: Partial<Record<AddressPart, string>> = ADDRESS_FIELDS[type];
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
              type: part === "state" ? ("state" as const) : ("text" as const),
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
        { id: "pronouns", type: "list", reviewLabel: "Pronouns" },
        {
          id: "otherPronouns",
          type: "text",
          reviewLabel: "Other pronouns",
          when: (data) => shouldShowOtherPronouns(data.pronouns),
        },
      ],
      options,
      {},
    );
  },

  /** Each entry is labeled `itemLabel` and its position, like "Address 2". */
  repeatingEntry(name: string, options: SingleFieldOptions<"repeatingEntry">) {
    return singleField("repeatingEntry", "list", name, options);
  },

  /** `content` is markdown. */
  banner(
    content: Text,
    {
      when,
      ...props
    }: Omit<BlockPropsByKind["banner"], "content"> & {
      when?: Condition;
    } = {},
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
    { when, title }: { when?: Condition; title?: OptionalText } = {},
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
