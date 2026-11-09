import type { FieldName, FormData } from "#constants/fields";
import type { Condition, StepNode, Text } from "./steps/types";

/** A single conditional field, visible when `when` returns true. */
type ConditionalField = {
  id: FieldName;
  when: (data: Partial<FormData>) => boolean;
};

/** Multiple fields sharing one visibility predicate. */
type ConditionalFieldGroup = {
  ids: readonly FieldName[];
  when: (data: Partial<FormData>) => boolean;
};

/**
 * A field entry within a step. Plain string = always visible.
 * Object form: `{ id, when }` or `{ ids, when }` for conditional visibility.
 */
export type Field = FieldName | ConditionalField | ConditionalFieldGroup;

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
 * A step described by a typed body tree. Every reader (rendering,
 * visibility, review, persistence, PDF data) derives what it needs from
 * `body`.
 *
 * @example
 * const nameStep = defineStep({
 *   id: "legal-name",
 *   title: "What is your legal name?",
 *   body: [field.name("oldName")],
 * });
 */
export interface BodyStep extends StepBase {
  body: readonly StepNode[];
  fields?: never;
  component?: never;
}

/**
 * A step rendered by its own component, with the fields it writes listed
 * separately. Kept until every form is converted to `body`.
 */
export interface LegacyStep extends StepBase {
  /**
   * All fields this step writes to. Plain string = always visible.
   * Object form: `{ id, when }` = single conditional field.
   * Object form: `{ ids, when }` = multiple fields sharing one predicate.
   */
  fields: readonly Field[];

  /** The React component rendered when this step is active. */
  component: React.ComponentType<{ stepConfig: Step }>;

  body?: never;
}

/** Configuration for a single step in a form flow. */
export type Step = BodyStep | LegacyStep;

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
