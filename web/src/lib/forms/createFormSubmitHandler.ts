import type { SubmitEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  type FormDownload,
  resolveInstructions,
  type Step,
} from "#constants/forms";
import { resolveFormVisibility } from "./formVisibility";

export function createFormSubmitHandler(
  {
    steps,
    loadDownload,
  }: { steps: readonly Step[]; loadDownload: () => Promise<FormDownload> },
  form: UseFormReturn<FieldValues>,
) {
  return async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = form.getValues();
    const [download, { downloadPdfPacket }] = await Promise.all([
      loadDownload(),
      import("#lib/pdfs/downloadPdfPacket"),
    ]);
    const { visibleFields, includedPdfs } = resolveFormVisibility(
      steps,
      formData,
      download.pdfs,
    );

    await downloadPdfPacket({
      title: download.title,
      instructions: resolveInstructions(download.instructions, formData),
      pdfs: includedPdfs,
      data: visibleFields,
    });
  };
}
