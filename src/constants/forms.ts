import type { Step } from "../forms/types";
import type { FormData } from "./fields";
import type { StateId } from "./jurisdictions";
import type { PDFId } from "./pdf";

export type FormSlug =
  | "affidavit-of-indigency-ma"
  | "court-order-ma"
  | "court-order-ma-minor"
  | "court-order-ri"
  | "social-security";

export type CategoryId =
  | "birth-certificate"
  | "court-order"
  | "devices"
  | "education"
  | "entertainment"
  | "finance"
  | "gaming"
  | "government"
  | "health"
  | "housing"
  | "other"
  | "passport"
  | "personal"
  | "shopping"
  | "social"
  | "social-security"
  | "state-id"
  | "subscriptions"
  | "travel";

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
  required: "required" | "notRequired";
}

/**
 * Complete configuration for a form.
 */
export interface FormConfig {
  /** Display title */
  title: string;
  /** Optional description */
  description?: string;
  /** State abbreviation, e.g. "ma" */
  state?: StateId;
  /** Category identifier */
  category: CategoryId;
  /** Costs associated with this form */
  costs?: readonly FormCost[];
  /** If true, excluded from the public forms listing */
  unlisted?: boolean;

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
