import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { defineStep } from "#lib/forms/defineStep";

export const requestTypeStep = defineStep({
  id: "request-type",
  title: "What would you like to change?",
  fields: ["nyCourtOrderRequest"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="nyCourtOrderRequest"
          label="Requested change"
          labelHidden
          isRequired
          options={[
            { value: "Name change", label: "My name" },
            { value: "Sex designation change", label: "My sex designation" },
            { value: "Both", label: "Both my name and sex designation" },
          ]}
        />
      </FormStep>
    );
  },
});
