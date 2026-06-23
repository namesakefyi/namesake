import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";

import { defineStep } from "#lib/forms/defineStep";

export const newGenderStep = defineStep({
  id: "new-gender",
  title: "What is your new gender marker?",
  fields: ["newGender"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="newGender"
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
