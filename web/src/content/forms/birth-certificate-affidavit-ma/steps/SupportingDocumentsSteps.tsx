import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

export const supportingDocumentsStep = defineStep({
  id: "supporting-documents",
  title: "Are you submitting the following items?",
  description:
    "In addition to the affidavit, you have the option to submit the documents and payments below.",
  fields: ["nameChangeDecreeIncluded", "paymentIncluded"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField
        name="nameChangeDecreeIncluded"
        label="A court-certified copy of a legal name change decree (if applicable)"
      />
      <CheckboxField
        name="paymentIncluded"
        label="A check or money order for all the fees"
      />
    </FormStep>
  ),
});
