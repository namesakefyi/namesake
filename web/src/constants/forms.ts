import type { Condition, Question, Text } from "#lib/forms/questions";
import type { FormData } from "./fields";
import type { PDFId } from "./pdf";

export interface Step {
  id: string;
  title: Text;
  description?: Text;
  when?: Condition;
  questions: readonly Question[];
}

/**
 * Configuration for a PDF within a form.
 */
export interface FormPdfConfig {
  /** The PDF identifier */
  pdfId: PDFId;
  /** Optional predicate to determine if this PDF should be included based on form data */
  when?: (data: Partial<FormData>) => boolean;
}

/**
 * A single instruction entry. Plain string = always included.
 * Object form: `{ text, when }` = included only when `when` returns true.
 */
export type Instruction =
  | string
  | { text: string; when: (data: Partial<FormData>) => boolean };

/**
 * Resolves an instructions array to plain strings, filtering out conditional
 * entries whose `when` predicate returns false for the given form data.
 */
export function resolveInstructions(
  instructions: readonly Instruction[],
  data: Partial<FormData>,
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
 * Runtime configuration for a form. Static display metadata such as
 * title and description are set in `index.yml` and fetched via Astro's
 * content collection.
 */
export interface FormConfig {
  /** Ordered steps, including optional guards for conditional inclusion. */
  steps: readonly Step[];
  /** PDFs included in this form */
  pdfs: readonly FormPdfConfig[];
  /** Title for the downloaded PDF package */
  downloadTitle: string;
  /**
   * Instructions shown on the cover page of the downloaded packet.
   * Plain string = always included.
   * Object form: `{ text, when }` = included only when `when` returns true.
   */
  instructions: readonly Instruction[];
}

/**
 * Sentiment rating options for form feedback.
 */
export const FORM_FEEDBACK_SENTIMENT = {
  positive: "Positive",
  negative: "Negative",
} as const;

export type FormFeedbackSentiment = keyof typeof FORM_FEEDBACK_SENTIMENT;
