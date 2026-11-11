import type { Condition, Data } from "#lib/forms/questions";

/** Matches libpdf's FieldValue, plus undefined for omitted fields. */
export type PDFFieldValue = string | boolean | string[] | null | undefined;

/** Valid field types that can appear in a generated pdfSchema. */
export type PdfFieldType = "text" | "checkbox" | "radio" | "button";

/** A PDF's fillable fields and their types, from its generated `schema.ts`. */
export type PdfSchema = Readonly<Record<string, PdfFieldType>>;

export interface PDFDefinition<S extends PdfSchema = PdfSchema> {
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

  /** The fillable fields, from the PDF's `schema.ts`. */
  fields: S;
}

/**
 * A value for every field of a PDF. Fields left blank on purpose are
 * written as `undefined`.
 */
export type PdfValues<S extends PdfSchema = PdfSchema> = {
  [K in keyof S]: PDFFieldValue;
};

/** A PDF a form fills, and how it fills it. */
export interface FormPdf<S extends PdfSchema = PdfSchema> {
  pdf: PDFDefinition<S>;
  /** Includes the PDF only when this returns true. */
  when?: Condition;
  fill: (data: Data) => PdfValues<S>;
}
