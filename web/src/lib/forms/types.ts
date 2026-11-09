import type { ComponentType } from "react";
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

export type Condition = (data: Data) => boolean;

export type Text = string | ((data: Data) => string);
export type OptionalText = string | ((data: Data) => string | undefined);

type FieldDef = (typeof FIELD_DEFS)[number];

export type BooleanFieldName = Extract<FieldDef, { type: "boolean" }>["name"];
export type StringFieldName = Extract<FieldDef, { type: "string" }>["name"];
export type ListFieldName = Extract<FieldDef, { type: "string[]" }>["name"];
export type ValuedFieldName = Extract<FieldDef, { values: object }>["name"];
export type TextFieldName = Exclude<StringFieldName, ValuedFieldName>;

/** The allowed values of a field, or `string` when none are declared. */
export type FieldValue<K extends FieldName> = K extends ValuedFieldName
  ? Extract<FieldDef, { name: K; values: object }>["values"][number]
  : string;

export type OptionLabel = string | { label: string; description?: string };

/** Labels for every allowed value of a field, each exactly once. */
export type Options<K extends FieldName> = {
  [V in FieldValue<K>]: OptionLabel;
};

export type OptionLabels = Readonly<Record<string, OptionLabel>>;

export interface WrittenField<W extends FieldName = FieldName> {
  id: W;
  when?: Condition;
  reviewLabel?: Text;
  options?: OptionLabels;
}

export interface FieldPropsByKind {
  shortText: { size?: number };
  longText: Record<never, never>;
  number: {
    min?: number;
    currency?: boolean;
    defaultValue?: number;
  };
  memorableDate: Record<never, never>;
  checkbox: Record<never, never>;
  yesNo: {
    yesLabel?: string;
    noLabel?: string;
    extraChoices?: readonly ExtraChoice[];
  };
  radioGroup: {
    options: OptionLabels;
    extraChoices?: readonly (typeof PREFER_NOT_TO_ANSWER)[];
  };
  checkboxGroup: {
    options: OptionLabels;
    extraChoices?: readonly (typeof PREFER_NOT_TO_ANSWER)[];
  };
  comboBox: { source: ComboBoxSource; placeholder?: string };
  phone: Record<never, never>;
  email: Record<never, never>;
  languageSelect: Record<never, never>;
  name: { type: NameType };
  address: { type: AddressType; address2: boolean; county: boolean };
  pronounSelect: Record<never, never>;
  repeatingEntry: {
    min: number;
    max?: number;
    itemLabel: string;
    size?: number;
  };
}

export type FieldKind = keyof FieldPropsByKind;

export interface CommonFieldOptions {
  when?: Condition;
  /** Defaults to the field's label. */
  reviewLabel?: Text;
}

export interface FieldNode<
  K extends FieldKind = FieldKind,
  W extends FieldName = FieldName,
> extends CommonFieldOptions {
  type: "field";
  kind: K;
  /** Set for nodes that write a single field. */
  name?: W;
  /** Undefined when the nearest title stands in as a hidden label. */
  label?: Text;
  description?: string;
  writes: readonly WrittenField<W>[];
  props: FieldPropsByKind[K];
}

export type AnyFieldNode = { [K in FieldKind]: FieldNode<K> }[FieldKind];

export interface BannerNode {
  type: "block";
  kind: "banner";
  /** Markdown */
  content: Text;
  variant?: "info" | "success" | "warning" | "error";
  when?: Condition;
}

export interface SubsectionNode {
  type: "block";
  kind: "subsection";
  children: readonly StepNode[];
  title?: OptionalText;
  when?: Condition;
}

export interface DisplayNode {
  type: "block";
  kind: "display";
  component: ComponentType<any>;
  props?: object;
}

export type BlockNode = BannerNode | SubsectionNode | DisplayNode;

export type BlockKind = BlockNode["kind"];

export type StepNode = AnyFieldNode | BlockNode;

export type NodeKind = FieldKind | BlockKind;

export interface Step {
  id: string;
  title: Text;
  description?: Text;
  /** Leaves the step out of the flow while this returns false. */
  when?: Condition;
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
