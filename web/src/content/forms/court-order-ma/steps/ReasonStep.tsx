import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep } from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineStep } from "#lib/forms/defineStep";

export const reasonStep = defineStep({
  id: "reason",
  title: "What is the reason you're changing your name?",
  fields: [
    "reasonForChangingName",
    "hasNoRecordOfOtherStateConvictionsProbationParole",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <LongTextField
        name="reasonForChangingName"
        label="Reason for name change"
      />
      <NameChangeReasonBanner />
      <CheckboxField
        name="hasNoRecordOfOtherStateConvictionsProbationParole"
        label="I certify that I have no record of convictions, probation, or parole in any other state."
      />
    </FormStep>
  ),
});
