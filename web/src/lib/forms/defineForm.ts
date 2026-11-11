import type { FormConfig, FormDownload } from "#constants/forms";
import type { FormPdf, PdfSchema } from "#constants/pdf";

/** Pairs each PDF with a `fill` that must return every one of its fields. */
type FormPdfs<P extends readonly PdfSchema[]> = {
  [I in keyof P]: FormPdf<P[I]>;
};

export function defineForm<const P extends readonly PdfSchema[]>({
  download,
  ...config
}: Omit<FormConfig, "download"> & {
  download: Omit<FormDownload, "title" | "pdfs"> & {
    title?: string;
    pdfs: FormPdfs<P>;
  };
}): FormConfig {
  return {
    ...config,
    download: { ...download, title: download.title ?? config.title },
  };
}
