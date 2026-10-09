import { Banner } from "#components/common/Banner";
import { FormStep } from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const nameReasonStep = defineStep({
  id: "name-reason",
  title: "What are your reasons for changing your name?",
  when: requestsNameChange,
  fields: ["reasonForChangingName"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <LongTextField
          name="reasonForChangingName"
          label="Reason for name change"
        />
        <Banner>
          <p>
            <strong>What do I write?</strong> Describe your own reason for
            changing your name. Examples:
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
      </FormStep>
    );
  },
});
