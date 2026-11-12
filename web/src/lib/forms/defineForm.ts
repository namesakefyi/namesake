import type {
  FormDefinition,
  FormDownload,
  FormPdf,
  Step,
} from "#constants/forms";
import type { PdfSchema } from "#constants/pdf";

/** Pairs each PDF with a `fill` that must return every one of its fields. */
type FormPdfs<P extends readonly PdfSchema[]> = {
  [I in keyof P]: FormPdf<P[I]>;
};

export function defineForm(meta: FormDefinition): FormDefinition {
  return meta;
}

export function defineSteps(steps: readonly Step[]): readonly Step[] {
  return steps;
}

export function defineDownload<const P extends readonly PdfSchema[]>(
  download: Omit<FormDownload, "pdfs"> & { pdfs: FormPdfs<P> },
): FormDownload {
  return download;
}
