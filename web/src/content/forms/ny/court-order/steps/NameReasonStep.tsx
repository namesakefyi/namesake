import { FormStep } from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const nameReasonStep = defineStep({
  id: "name-reason",
  title: "Why are you changing your name?",
  when: requestsNameChange,
  fields: ["reasonForChangingName"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <LongTextField
          name="reasonForChangingName"
          label="Reason for name change"
        />
        <NameChangeReasonBanner />
      </FormStep>
    );
  },
});
