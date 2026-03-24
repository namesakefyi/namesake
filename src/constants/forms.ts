import type { Step } from "@/forms/types";
import { courtOrderMaConfig } from "@/pages/forms/court-order-ma/config";
import { courtOrderMinorMaConfig } from "@/pages/forms/court-order-ma-minor/config";
import { socialSecurityConfig } from "@/pages/forms/social-security/config";
import type { FormData } from "./fields";
import type { PDFId } from "./pdf";

/**
 * Const representing all valid form slugs.
 * Update this array whenever a new form is added.
 */
export const FORM_SLUGS = [
  "court-order-ma-minor",
  "court-order-ma",
  "social-security",
] as const;

export type FormSlug = (typeof FORM_SLUGS)[number];

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

/**
 * Complete configuration for a form.
 */
export interface FormConfig {
  /** Form identifier matching the URL slug */
  slug: FormSlug;
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
 * Registry of all form configurations.
 */
export const FORM_CONFIGS: Record<FormSlug, FormConfig> = {
  "court-order-ma-minor": courtOrderMinorMaConfig,
  "court-order-ma": courtOrderMaConfig,
  "social-security": socialSecurityConfig,
};

/**
 * Get a form configuration by slug.
 */
export function getFormConfig(slug: FormSlug): FormConfig | undefined {
  return FORM_CONFIGS[slug];
}

/**
 * Sentiment rating options for form feedback.
 */
export const FORM_FEEDBACK_SENTIMENT = {
  positive: "Positive",
  negative: "Negative",
} as const;

export type FormFeedbackSentiment = keyof typeof FORM_FEEDBACK_SENTIMENT;
