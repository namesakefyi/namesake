import type { Condition, FormData, Question, Text } from "#lib/forms/questions";
import type { CategoryId } from "./categories";
import type { FormPdf } from "./pdf";

export interface Step {
  id: string;
  title: Text;
  description?: Text;
  when?: Condition;
  questions: readonly Question[];
}

/**
 * A single instruction entry. Plain string = always included.
 * Object form: `{ text, when }` = included only when `when` returns true.
 */
export type Instruction = string | { text: string; when: Condition };

/**
 * Resolves an instructions array to plain strings, filtering out conditional
 * entries whose `when` predicate returns false for the given form data.
 */
export function resolveInstructions(
  instructions: readonly Instruction[],
  data: FormData,
): string[] {
  return instructions.flatMap((item) => {
    if (typeof item === "string") return [item];
    return item.when(data) ? [item.text] : [];
  });
}

export interface FormCost {
  title: string;
  amount: number;
  required: boolean;
}

/**
 * A form's `index.ts`: plain data that pages read while they build, before
 * any of the form's code reaches the browser.
 */
export interface FormMeta {
  /** Shown on the forms page, the form's title step and its preview image. */
  title: string;
  description?: string;
  category: CategoryId;
  /** Left off the forms page; still reachable by its URL. */
  unlisted?: boolean;
  /** Fees the person pays when filing, shown on the title step. */
  costs?: readonly FormCost[];
}

/** A form's three files together: `index.ts`, `steps.ts` and `download.ts`. */
export interface FormConfig extends FormMeta {
  /** Ordered steps, including optional guards for conditional inclusion. */
  steps: readonly Step[];
  /** The PDF packet the person downloads at the end. */
  download: FormDownload;
}

/** A form's `download.ts`, which loads once the person starts filling. */
export interface FormDownload {
  /** The packet's title, on its cover page and file name. */
  title: string;
  /**
   * Shown on the cover page. A plain string is always included; `{ text,
   * when }` is included only when `when` returns true.
   */
  instructions: readonly Instruction[];
  /** The PDFs in the packet, in order. */
  pdfs: readonly FormPdf[];
}

/**
 * Sentiment rating options for form feedback.
 */
export const FORM_FEEDBACK_SENTIMENT = {
  positive: "Positive",
  negative: "Negative",
} as const;

export type FormFeedbackSentiment = keyof typeof FORM_FEEDBACK_SENTIMENT;
