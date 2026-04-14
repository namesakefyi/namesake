import type { FieldName, FormData } from "../constants/fields";

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

/**
 * Configuration for a single step in a form flow.
 *
 * @example
 * const myStep: Step = {
 *   id: "legal-name",
 *   title: "What is your legal name?",
 *   fields: ["firstName", "lastName"],
 *   component: LegalNameStep,
 * };
 */
export interface Step {
  /** Unique identifier used for navigation and persistence. */
  id: string;

  /** Displayed in the navigation bar and review table. */
  title: string | ((data: Partial<FormData>) => string);

  /** Optional subtitle shown beneath the title on the step. */
  description?: string | ((data: Partial<FormData>) => string);

  /**
   * All fields this step writes to. Plain string = always visible.
   * Object form: `{ id, when }` = single conditional field.
   * Object form: `{ ids, when }` = multiple fields sharing one predicate.
   */
  fields: readonly Field[];

  /**
   * When provided, the step is only included in the flow if this returns
   * true. Evaluated with live form data on every navigation.
   *
   * @example
   * when: (data) => data.isFilingForSomeoneElse === true,
   */
  when?: (data: Partial<FormData>) => boolean;

  /** The React component rendered when this step is active. */
  component: React.ComponentType<{ stepConfig: Step }>;
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
