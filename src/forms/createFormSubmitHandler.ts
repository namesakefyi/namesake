import type { SubmitEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { type FormConfig, resolveInstructions } from "../constants/forms";
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
    const { visibleFields, pdfsToInclude } = resolveFormVisibility(
      config.steps,
      formData,
      config.pdfs,
    );

    const [{ loadPdfs }, { downloadMergedPdf }] = await Promise.all([
      import("../pdfs/utils/loadPdfs"),
      import("../pdfs/utils/downloadMergedPdf"),
    ]);

    const pdfs = await loadPdfs(pdfsToInclude);

    const instructions = resolveInstructions(config.instructions, formData);

    await downloadMergedPdf({
      title: config.downloadTitle,
      instructions,
      pdfs,
      userData: visibleFields,
    });
  };
}
