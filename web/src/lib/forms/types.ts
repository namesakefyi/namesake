import type { ComponentType, ReactNode } from "react";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";
import type { ComboBoxSource } from "#constants/comboBoxSources";
import type { AddressType, NameType } from "#constants/fieldGroups";
import type {
  ExtraChoice,
  FIELD_DEFS,
  FieldName,
  FormData,
  PREFER_NOT_TO_ANSWER,
} from "#constants/fields";

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

/** Text that may be absent, such as a title shown only sometimes. */
export type OptionalText = string | ((data: Data) => string | undefined);

type FieldDef = (typeof FIELD_DEFS)[number];

export type BooleanFieldName = Extract<FieldDef, { type: "boolean" }>["name"];
export type StringFieldName = Extract<FieldDef, { type: "string" }>["name"];
export type ListFieldName = Extract<FieldDef, { type: "string[]" }>["name"];

/** String fields whose allowed values are declared in FIELD_DEFS. */
export type ValuedFieldName = Extract<FieldDef, { values: object }>["name"];

/** String fields with no declared values, for free-form text. */
export type TextFieldName = Exclude<StringFieldName, ValuedFieldName>;

/** The allowed values of a field, or `string` when none are declared. */
export type FieldValue<K extends FieldName> = K extends ValuedFieldName
  ? Extract<FieldDef, { name: K; values: object }>["values"][number]
  : string;

/** An option's label, optionally with a description shown beneath it. */
export type OptionLabel = string | { label: string; description?: string };

/** Labels for every allowed value of a field, each exactly once. */
export type Options<K extends FieldName> = {
  [V in FieldValue<K>]: OptionLabel;
};

/** Labels keyed by stored value, as readers see them. */
export type OptionLabels = Readonly<Record<string, OptionLabel>>;

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
    /** Format as US dollars, with cents only when entered. */
    currency?: boolean;
    /** The answer before someone changes it. */
    defaultValue?: number;
  };
  "field.memorableDate": Record<never, never>;
  "field.checkbox": Record<never, never>;
  "field.yesNo": {
    yesLabel?: string;
    noLabel?: string;
    extraChoices?: readonly ExtraChoice[];
  };
  "field.radioGroup": {
    options: OptionLabels;
    extraChoices?: readonly (typeof PREFER_NOT_TO_ANSWER)[];
  };
  "field.checkboxGroup": {
    options: OptionLabels;
    extraChoices?: readonly (typeof PREFER_NOT_TO_ANSWER)[];
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

/** What a `render` override receives from `<FormStep>`. */
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
  /** Replaces the default component; `<FormStep>` computes the props. */
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
  title?: OptionalText;
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
  /** How each written field is labeled in the review table. */
  reviewLabels: Readonly<Partial<Record<W, Text>>>;
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

interface StepBase {
  /** Unique identifier used for navigation and persistence. */
  id: string;

  /** Displayed in the navigation bar and review table. */
  title: Text;

  /** Optional subtitle shown beneath the title on the step. */
  description?: Text;

  /**
   * When provided, the step is only included in the flow if this returns
   * true. Evaluated with live form data on every navigation.
   *
   * @example
   * when: isTrue("isFilingForSomeoneElse"),
   */
  when?: Condition;
}

/**
 * A step in a form flow, described by a typed body tree. Every reader
 * (rendering, visibility, review, persistence, PDF data) derives what it
 * needs from `body`.
 *
 * @example
 * {
 *   id: "legal-name",
 *   title: "What is your legal name?",
 *   body: [field.name("oldName")],
 * }
 */
export interface Step extends StepBase {
  body: readonly StepNode[];
}

export type FormPhase =
  | "title"
  | "filling"
  | "review"
  | "editing"
  | "submitting"
  | "complete";

export interface FormMachineContext {
  formSlug: string;
  currentStepId: string | null;
  editingStepId: string | null;
}

export type FormMachineEvent =
  | { type: "START" }
  | { type: "GOTO_STEP"; stepId: string }
  | { type: "GOTO_REVIEW" }
  | { type: "GOTO_TITLE" }
  | { type: "EDIT_STEP"; stepId: string }
  | { type: "SAVE_EDIT" }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_DONE" }
  | { type: "SUBMIT_ERROR" };
