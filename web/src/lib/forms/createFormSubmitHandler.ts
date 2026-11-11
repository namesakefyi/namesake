import type { SubmitEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { type FormConfig, resolveInstructions } from "#constants/forms";
import { resolveFormVisibility } from "./formVisibility";

/**
 * Creates a form submit handler from a form configuration.
 * PDF lib and utilities are loaded on demand when the user clicks download.
 */
export function createFormSubmitHandler(
  config: FormConfig,
  form: UseFormReturn<FieldValues>,
) {
  return async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = form.getValues();
    const { download } = config;
    const { visibleFields, includedPdfs } = resolveFormVisibility(
      config.steps,
      formData,
      download.pdfs,
    );

    const { downloadFilledPdf } = await import("#lib/pdfs/downloadFilledPdf");

    await downloadFilledPdf({
      title: download.title,
      instructions: resolveInstructions(download.instructions, formData),
      pdfs: includedPdfs,
      userData: visibleFields,
    });
  };
}
