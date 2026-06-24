import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";

import { defineStep } from "#lib/forms/defineStep";

export const newGenderStep = defineStep({
  id: "new-gender",
  title: "What is your new gender marker?",
  description:
    "This is the gender marker that will display on your amended birth certificate.",
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
            value: "Female",
          },
          {
            label: "Male",
            value: "Male",
          },
          {
            label: "X",
            value: "X",
          },
        ]}
      />
    </FormStep>
  ),
});
