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
import { type FieldName, shouldShowOtherPronouns } from "#constants/fields";
import type {
  BannerNode,
  BooleanFieldName,
  CommonFieldOptions,
  Condition,
  DisplayNode,
  FieldKind,
  FieldNode,
  FieldPropsByKind,
  ListFieldName,
  OptionalText,
  OptionLabels,
  Options,
  StepNode,
  StringFieldName,
  SubsectionNode,
  Text,
  TextFieldName,
  WrittenField,
} from "./types";

interface LabelOptions extends CommonFieldOptions {
  /** Omit for the single question under a title, which becomes its label. */
  label?: Text;
  description?: string;
}

type SingleFieldOptions<K extends FieldKind> = LabelOptions &
  FieldPropsByKind[K];

type AddressOptions<T extends AddressType> = CommonFieldOptions &
  (T extends ExtendedAddressType
    ? { address2?: boolean; county?: boolean }
    : { address2?: never; county?: never });

/** `props` is required when the component has required props. */
type DisplayArguments<P> =
  Record<never, never> extends P
    ? [options?: { props?: P }]
    : [options: { props: P }];

function singleField<K extends FieldKind, W extends FieldName>(
  kind: K,
  name: W,
  { label, description, when, reviewLabel, ...props }: SingleFieldOptions<K>,
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
    writes: [{ id: name, options }],
    props: props as unknown as FieldPropsByKind[K],
  };
}

function composite<K extends FieldKind>(
  kind: K,
  writes: readonly WrittenField[],
  { when, reviewLabel }: CommonFieldOptions,
  props: FieldPropsByKind[K],
): FieldNode<K> {
  return { type: "field", kind, when, reviewLabel, writes, props };
}

/**
 * Builders for everything in a step's `body`. Each is named after its
 * component with the `Field` or `Form` affix dropped: `YesNoField` →
 * `node.yesNo`, `FormSubsection` → `node.subsection`.
 */
export const node = {
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

  yesNo<W extends BooleanFieldName>(
    name: W,
    options: SingleFieldOptions<"yesNo"> = {},
  ) {
    return singleField("yesNo", name, options);
  },

  radioGroup<W extends StringFieldName>(
    name: W,
    options: Omit<SingleFieldOptions<"radioGroup">, "options"> & {
      options: Options<W>;
    },
  ) {
    return singleField("radioGroup", name, options);
  },

  checkboxGroup<W extends ListFieldName>(
    name: W,
    options: SingleFieldOptions<"checkboxGroup">,
  ) {
    return singleField("checkboxGroup", name, options);
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
      return id ? [{ id, reviewLabel: getAddressReviewLabel(type, part) }] : [];
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
    options?: { variant?: BannerNode["variant"]; when?: Condition },
  ): BannerNode {
    return { type: "block", kind: "banner", content, ...options };
  },

  subsection(
    children: readonly StepNode[],
    options?: { title?: OptionalText; when?: Condition },
  ): SubsectionNode {
    return { type: "block", kind: "subsection", children, ...options };
  },

  /** A component that writes no data. */
  display<P extends object>(
    component: ComponentType<P>,
    ...[options]: DisplayArguments<P>
  ): DisplayNode {
    return { type: "block", kind: "display", component, props: options?.props };
  },
};
