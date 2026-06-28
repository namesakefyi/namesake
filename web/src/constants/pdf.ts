import type { FormData } from "./fields";
import type { JurisdictionId } from "./jurisdictions";

/** Matches libpdf's FieldValue, plus undefined for omitted fields. */
export type PDFFieldValue = string | boolean | string[] | null | undefined;

/** Valid field types that can appear in a generated pdfSchema. */
export type PdfFieldType = "text" | "checkbox" | "radio" | "button";

export const PDF_IDS = [
  "affidavit-of-indigency",
  "cjp25-petition-to-change-name-of-minor",
  "cjp27-petition-to-change-name-of-adult",
  "cjp34-cori-and-wms-release-request",
  "ss5-application-for-social-security-card",
  "pc8.1-change-of-name",
  "background-check-authorization-of-release",
] as const;

export type PDFId = (typeof PDF_IDS)[number];

export interface PDFDefinition<TPdfFieldName extends string = string> {
  /**
   * The unique identifier for the PDF definition.
   * @example "cjp27-petition-to-change-name-of-adult"
   * @url https://github.com/namesakefyi/namesake/tree/main/src/forms/README.md
   */
  id: PDFId;

  /**
   * The title of the form. Do not include the form code or state.
   * @example "Petition to Change Name of Adult"
   */
  title: string;

  /**
   * The form code, if one exists.
   * @optional
   * @example "CJP-27"
   */
  code?: string;

  /**
   * The jurisdiction of the form.
   * @example "ma"
   */
  jurisdiction?: JurisdictionId;

  /**
   * The canonical URL of the original form. This should be a link to a .gov website or other official source.
   */
  canonicalUrl: string;

  /**
   * The path to the PDF file, imported as a module.
   */
  pdfPath: string;

  /**
   * Function that maps form data to PDF field values.
   * @example
   * ```ts
   * resolver: (data) => ({
   *   division: data.residenceCounty,
   *   petitionerName: joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
   * })
   * ```
   */
  resolver: PDFResolver<TPdfFieldName>;
}

export type PDFResolver<
  TPdfFieldName extends string,
  TFormData = Partial<FormData>,
> = (data: TFormData) => Record<TPdfFieldName, PDFFieldValue>;
