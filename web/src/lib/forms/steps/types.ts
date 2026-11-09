import type { ComponentType, ReactNode } from "react";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";
import type {
  DONT_KNOW,
  FIELD_DEFS,
  FieldName,
  FormData,
  PREFER_NOT_TO_ANSWER,
} from "#constants/fields";
import type { ComboBoxSource } from "./comboBoxSources";
import type { AddressType, NameType } from "./fieldGroups";

export type Data = Partial<FormData>;

/**
 * A visibility predicate. `deps` lists fields the predicate reads in
 * addition to what tracing finds (branches that short-circuit logic skips).
 */
export interface Condition {
  (data: Data): boolean;
  deps?: readonly FieldName[];
}

/** Text that is either fixed or computed from the answers so far. */
export type Text = string | ((data: Data) => string);

type FieldDef = (typeof FIELD_DEFS)[number];

export type BooleanFieldName = Extract<FieldDef, { type: "boolean" }>["name"];
export type StringFieldName = Extract<FieldDef, { type: "string" }>["name"];
export type ListFieldName = Extract<FieldDef, { type: "string[]" }>["name"];

/** String fields whose allowed values are declared in FIELD_DEFS. */
export type ValuedFieldName = Extract<FieldDef, { options: object }>["name"];

/** String fields with no declared values, for free-form text. */
export type TextFieldName = Exclude<StringFieldName, ValuedFieldName>;

/** The allowed values of a field, or `string` when none are declared. */
export type FieldValue<K extends FieldName> = K extends ValuedFieldName
  ? keyof Extract<FieldDef, { name: K; options: object }>["options"] & string
  : string;

/** An option's label, optionally with a description shown beneath it. */
export type OptionLabel = string | { label: string; description?: string };

/** Labels for every allowed value of a field, each exactly once. */
export type Options<K extends FieldName> = {
  [V in FieldValue<K>]: OptionLabel;
};

/** Labels keyed by stored value, as readers see them. */
export type OptionLabels = Readonly<Record<string, OptionLabel>>;

/** Extra answers a question can offer beyond its own options. */
export type Allowance = typeof PREFER_NOT_TO_ANSWER | typeof DONT_KNOW;

/** A field a node writes, with what readers need to know about it. */
export interface WrittenField<W extends FieldName = FieldName> {
  id: W;
  /** Extra condition on this field alone, on top of the node's. */
  when?: Condition;
  /** Label in the review table, when it differs from the node's. */
  reviewLabel?: Text;
  options?: OptionLabels;
}

/** Builder-specific settings, keyed by node kind. */
export interface FieldPropsByKind {
  "field.shortText": { size?: number };
  "field.longText": Record<never, never>;
  "field.number": {
    min?: number;
    /** Format as US dollars: whole dollars only, or with cents. */
    currency?: "dollars" | "cents";
    /** The answer before someone changes it. */
    defaultValue?: number;
  };
  "field.memorableDate": Record<never, never>;
  "field.checkbox": Record<never, never>;
  "field.yesNo": {
    yesLabel?: string;
    noLabel?: string;
    allow?: readonly Allowance[];
  };
  "field.radioGroup": {
    options: OptionLabels;
    allow?: readonly (typeof PREFER_NOT_TO_ANSWER)[];
  };
  "field.checkboxGroup": {
    options: OptionLabels;
    allow?: readonly (typeof PREFER_NOT_TO_ANSWER)[];
  };
  "field.comboBox": { source: ComboBoxSource; placeholder?: string };
  "field.phone": Record<never, never>;
  "field.email": Record<never, never>;
  "field.languageSelect": Record<never, never>;
  "field.name": { type: NameType };
  "field.address": { type: AddressType; address2: boolean; county: boolean };
  "field.pronounSelect": Record<never, never>;
  "field.repeatingEntry": {
    min: number;
    max?: number;
    itemLabel: string;
    size?: number;
  };
}

export type FieldKind = keyof FieldPropsByKind;

/** What a `render` override receives from `<StepBody>`. */
export interface FieldRenderProps {
  /** The bound field, for nodes that write a single field. */
  field?: ControllerRenderProps<FormData>;
  fieldState?: ControllerFieldState;
  name?: FieldName;
  label: string;
  labelHidden: boolean;
  description?: string;
  choices?: readonly { value: string; label: string; description?: string }[];
}

/** Settings every field builder accepts. */
export interface CommonFieldOptions {
  /** Shown only while this returns true. */
  when?: Condition;
  /** Label in the review table. Defaults to the field's label. */
  reviewLabel?: Text;
  /** Replaces the default component; `<StepBody>` computes the props. */
  render?: (props: FieldRenderProps) => ReactNode;
}

export interface FieldNode<
  K extends FieldKind = FieldKind,
  W extends FieldName = FieldName,
> extends CommonFieldOptions {
  type: "field";
  kind: K;
  /** The field for nodes that write exactly one. */
  name?: W;
  /** Undefined when the step title stands in as a hidden label. */
  label?: Text;
  /** Help text shown with the input. */
  description?: string;
  writes: readonly WrittenField<W>[];
  props: FieldPropsByKind[K];
}

/** Any field node, narrowable by `kind`. */
export type AnyFieldNode = { [K in FieldKind]: FieldNode<K> }[FieldKind];

export interface BannerNode {
  type: "block";
  kind: "block.banner";
  /** Markdown, rendered with react-markdown. */
  content: Text;
  variant?: "info" | "success" | "warning" | "error";
  when?: Condition;
}

export interface SubsectionNode {
  type: "block";
  kind: "block.subsection";
  children: readonly StepNode[];
  title?: Text;
  when?: Condition;
}

export interface NoteNode {
  type: "block";
  kind: "block.note";
  content: Text;
}

export interface DisplayNode {
  type: "block";
  kind: "block.display";
  component: ComponentType<any>;
  props?: object;
  /** Fields the component reads; empty for static content. */
  reads: readonly FieldName[];
}

/** What a `block.custom` component receives. */
export interface CustomRenderProps {
  form: UseFormReturn<FormData>;
  writes: readonly FieldName[];
}

export interface CustomNode<W extends FieldName = FieldName> {
  type: "block";
  kind: "block.custom";
  writes: readonly W[];
  render: (props: CustomRenderProps) => ReactNode;
}

export type BlockNode =
  | BannerNode
  | SubsectionNode
  | NoteNode
  | DisplayNode
  | CustomNode;

export type BlockKind = BlockNode["kind"];

export type StepNode = AnyFieldNode | BlockNode;

export type NodeKind = FieldKind | BlockKind;
