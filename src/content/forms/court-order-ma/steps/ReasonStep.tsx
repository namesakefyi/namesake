import { Banner } from "#components/common/Banner";
import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep } from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
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
      <Banner>
        <p>
          <strong>What do I write?</strong> Provide a basic reason—no need to go
          into detail. Examples:
        </p>
        <ul>
          <li>"I want a name which aligns with my gender identity."</li>
          <li>"This is the name everyone knows me by."</li>
          <li>
            "This is my preferred name and I wish to obtain proper
            documentation."
          </li>
          <li>"I am transgender."</li>
        </ul>
      </Banner>
      <CheckboxField
        name="hasNoRecordOfOtherStateConvictionsProbationParole"
        label="I certify that I have no record of convictions, probation, or parole in any other state."
      />
    </FormStep>
  ),
});
