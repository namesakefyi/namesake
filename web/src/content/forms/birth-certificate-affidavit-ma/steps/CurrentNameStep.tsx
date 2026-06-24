import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";

export const birthNameStep = defineStep({
  id: "birth-name",
  title: "What is the name on your current birth certificate?",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="oldFirstName" label="First name" />
      <ShortTextField name="oldMiddleName" label="Middle name" />
      <ShortTextField name="oldLastName" label="Last name" />
    </FormStep>
  ),
});
