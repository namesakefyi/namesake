import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { nameOrFallback } from "@/forms/resolveStepContent";
import type { Step } from "@/forms/types";

export const reasonStep: Step = {
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
      <Banner>
        <p>
          <strong>What do I write?</strong> Provide a basic reason—no need to go
          into detail. Examples:
        </p>
        <ul>
          <li>"They want a name which aligns with their gender identity."</li>
          <li>"This is the name everyone knows them by."</li>
          <li>
            "This is their preferred name and they wish to obtain proper
            documentation."
          </li>
          <li>"They are transgender."</li>
        </ul>
      </Banner>
    </FormStep>
  ),
};
