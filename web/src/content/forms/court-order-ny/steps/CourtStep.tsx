import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { defineStep } from "#lib/forms/defineStep";
import { livesInNewYorkCity } from "../conditions";

export const courtStep = defineStep({
  id: "court",
  title: "Which court would you like to file in?",
  description:
    "Because you live in New York City, you can file your petition in Civil Court or Supreme Court in your borough. We recommend Civil Court, which has a lower filing fee.",
  when: livesInNewYorkCity,
  fields: ["courtType"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="courtType"
          label="Court"
          labelHidden
          options={[
            { value: "Civil", label: "Civil Court" },
            { value: "Supreme", label: "Supreme Court" },
          ]}
        />
      </FormStep>
    );
  },
});
