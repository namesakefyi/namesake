import { FormStep } from "#components/forms/FormStep";
import { MemorableDateField } from "#components/forms/MemorableDateField";
import { defineStep } from "#lib/forms/defineStep";

export const dateOfBirthStep = defineStep({
  id: "date-of-birth",
  title: "What is your date of birth?",
  fields: ["dateOfBirth"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <MemorableDateField label="Date of birth" name="dateOfBirth" />
    </FormStep>
  ),
});
