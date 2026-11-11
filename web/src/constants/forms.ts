import type { Condition, Data, Question, Text } from "#lib/forms/questions";
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
  data: Data,
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

/** A form: what it's called, the questions it asks, and what it downloads. */
export interface FormConfig {
  /** Shown on the forms page, the form's title step and its preview image. */
  title: string;
  description?: string;
  category: CategoryId;
  /** Left off the forms page; still reachable by its URL. */
  unlisted?: boolean;
  /** Fees the person pays when filing, shown on the title step. */
  costs?: readonly FormCost[];
  /** Ordered steps, including optional guards for conditional inclusion. */
  steps: readonly Step[];
  /** The PDF packet the person downloads at the end. */
  download: FormDownload;
}

export interface FormDownload {
  /** The packet's title, on its cover page and file name. Defaults to the form's title. */
  title: string;
  /**
   * Shown on the cover page. A plain string is always included; `{ text,
   * when }` is included only when `when` returns true.
   */
  instructions: readonly Instruction[];
  /** The PDFs in the packet, in order. */
  pdfs: readonly FormPdf[];
}

/** What the forms page and title step show about each of a form's PDFs. */
export interface FormPdfSummary {
  title: string;
  /** The form code, if one exists, such as "CJP-27". */
  code?: string;
  /** Whether the PDF is included only for some answers. */
  conditional?: boolean;
  /** The blank PDF file. */
  file: string;
}

/**
 * Sentiment rating options for form feedback.
 */
export const FORM_FEEDBACK_SENTIMENT = {
  positive: "Positive",
  negative: "Negative",
} as const;

export type FormFeedbackSentiment = keyof typeof FORM_FEEDBACK_SENTIMENT;
