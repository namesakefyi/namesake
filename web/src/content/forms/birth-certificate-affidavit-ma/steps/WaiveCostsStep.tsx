import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

export const waiveCostsStep = defineStep({
  id: "waive-costs",
  title: "Do you need to waive the fees?",
  description:
    "To waive the fees, you'll need to file the Affidavit of Indigency. We can help you with that.",
  fields: ["waveDocumentFees"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField name="waveDocumentFees" label="Waive the fees" />
      </FormStep>
    );
  },
});
