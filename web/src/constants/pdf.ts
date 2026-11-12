/** Matches libpdf's FieldValue, plus undefined for omitted fields. */
export type PdfFieldValue = string | boolean | string[] | null | undefined;

export type PdfFieldType = "text" | "checkbox" | "radio" | "button";

/** A PDF's fillable fields and their kinds, from its generated `schema.ts`. */
export type PdfSchema = Readonly<Record<string, PdfFieldType>>;

export interface PdfDefinition<S extends PdfSchema = PdfSchema> {
  /**
   * The title of the form. Do not include the form code or state.
   * @example "Petition to Change Name of Adult"
   */
  title: string;

  /**
   * The form code, if one exists.
   * @example "CJP-27"
   */
  code?: string;

  /**
   * The canonical URL of the original form. This should be a link to a .gov website or other official source.
   */
  canonicalUrl: string;

  /** The PDF file, imported as a module. */
  file: string;

  /**
   * Type-only: the fillable fields, from the PDF's `schema.ts`. Kept out of
   * the bundle, since only `fill` type checks need them.
   */
  readonly fields?: S;
}

/**
 * A value for every field of a PDF. Fields left blank on purpose are
 * written as `undefined`.
 */
export type PdfValues<S extends PdfSchema = PdfSchema> = {
  [K in keyof S]: PdfFieldValue;
};
