import { FormStep } from "#components/forms/FormStep";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const familyStep = defineStep({
  id: "family",
  title: "What is your family situation?",
  when: requestsNameChange,
  fields: ["isCurrentlyMarried", "wasPreviouslyMarried", "hasChildrenUnder21"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isCurrentlyMarried"
          label="Are you currently married?"
        />
        <YesNoField
          name="wasPreviouslyMarried"
          label="Were you previously married?"
        />
        <YesNoField
          name="hasChildrenUnder21"
          label="Do you have any children under 21?"
        />
      </FormStep>
    );
  },
});
