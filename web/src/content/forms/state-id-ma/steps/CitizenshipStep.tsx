import { FormStep } from "#components/forms/FormStep";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

export const citizenshipStep = defineStep({
  id: "citizenship",
  title: "Are you a citizen of the United States?",
  description:
    "The RMV uses this answer for voter registration. It does not determine whether you can receive a license or ID.",
  fields: ["isUSCitizen"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField name="isUSCitizen" label="U.S. citizen?" labelHidden />
    </FormStep>
  ),
});
