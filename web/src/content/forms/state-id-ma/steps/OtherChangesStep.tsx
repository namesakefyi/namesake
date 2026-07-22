import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

export const otherChangesStep = defineStep({
  id: "other-changes",
  title: "Besides your name, what else are you changing?",
  description:
    "Namesake will mark name change on your application. Check any other information the RMV should update.",
  fields: [
    "shouldChangeAddress",
    "shouldChangeDateOfBirth",
    "shouldChangeGenderMarker",
    "shouldChangeHeight",
    "shouldChangeEyeColor",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField name="shouldChangeAddress" label="Address" />
      <CheckboxField name="shouldChangeDateOfBirth" label="Date of birth" />
      <CheckboxField name="shouldChangeGenderMarker" label="Gender marker" />
      <CheckboxField name="shouldChangeHeight" label="Height" />
      <CheckboxField name="shouldChangeEyeColor" label="Eye color" />
    </FormStep>
  ),
});
