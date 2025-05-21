import type { FormData, Jurisdiction } from ".";

export type PDFFields = Record<string, string | boolean | undefined>;

export const PDF_IDS = [
  "affidavit-of-indigency",
  "cjp27-petition-to-change-name-of-adult",
  "cjp34-cori-and-wms-release-request",
  "cjd400-motion-to-waive-publication",
  "cjd400-motion-to-impound-records",
  "ss5-application-for-social-security-card",
] as const;

export type PDFId = (typeof PDF_IDS)[number];

export interface PDFDefinition {
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
   * @example "CJP 27"
   */
  code?: string;

  /**
   * The jurisdiction of the form.
   * @example "MA"
   */
  jurisdiction?: Jurisdiction;

  /**
   * The path to the PDF file, imported as a module.
   */
  pdfPath: string;

  /**
   * A function that transforms the user data into a set of fields for the PDF.
   *
   * PDF field names may be in a variety of formats, from camelCase
   * to snake_case to a "Plain String" label. It's recommended to
   * rename fields into a consistent format matching our own schema
   * for ease of readability and testing.
   *
   * @url https://github.com/namesakefyi/namesake/tree/main/src/forms/README.md
   *
   * @example
   * ```ts
   * fields: (data) => ({
   *   firstNameField: data.newFirstName,
   *   middle_name_field: data.newMiddleName,
   *   "Last Name Field": data.newLastName,
   * })
   * ```
   */
  fields: (data: Partial<FormData>) => PDFFields;
}
