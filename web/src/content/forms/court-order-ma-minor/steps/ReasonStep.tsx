import { FormStep } from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineStep } from "#lib/forms/defineStep";
import { nameOrFallback } from "#lib/forms/resolveStepContent";

export const reasonStep = defineStep({
  id: "reason",
  title: (data) =>
    `What is the reason ${nameOrFallback(data, "the minor")} is changing names?`,
  fields: ["reasonForChangingName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <LongTextField
        name="reasonForChangingName"
        label="Reason for name change"
      />
      <NameChangeReasonBanner for="child" />
    </FormStep>
  ),
});
