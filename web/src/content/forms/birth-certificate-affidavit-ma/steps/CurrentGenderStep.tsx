import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";

import { defineStep } from "#lib/forms/defineStep";

export const currentGenderStep = defineStep({
  id: "current-gender",
  title: "What is your current gender marker?",
  fields: ["currentGender"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="currentGender"
        labelHidden
        label="Sex"
        options={[
          {
            label: "Female",
            value: "female",
          },
          {
            label: "Male",
            value: "male",
          },
          {
            label: "X",
            value: "x",
          },
        ]}
      />
    </FormStep>
  ),
});
