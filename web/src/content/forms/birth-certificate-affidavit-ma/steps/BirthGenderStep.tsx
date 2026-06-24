import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";

import { defineStep } from "#lib/forms/defineStep";

export const birthGenderStep = defineStep({
  id: "birth-gender",
  title: "Which gender marker appears on your birth certificate?",
  fields: ["oldGender"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="oldGender"
        labelHidden
        label="Current gender marker"
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
