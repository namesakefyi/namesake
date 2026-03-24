import { Banner } from "@/components/react/common/Banner";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const impoundCaseStep: Step = {
  id: "impound-case",
  title: "Would you like to impound your case?",
  description:
    "All court actions are public record by default. However, you can apply to impound your case to keep it private.",
  fields: [
    "shouldImpoundCourtRecords",
    {
      id: "reasonToImpoundCourtRecords",
      when: (data) => data.shouldImpoundCourtRecords === true,
    },
  ],
  component: ({ stepConfig }) => {
    const reasonVisible = useFieldVisible(
      stepConfig,
      "reasonToImpoundCourtRecords",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="shouldImpoundCourtRecords"
          label="Impound my case?"
          labelHidden
          yesLabel="Yes, apply to impound my case and keep my name change private"
          noLabel="No, it's okay for my case to be public"
        />
        <FormSubsection isVisible={reasonVisible}>
          <LongTextField
            name="reasonToImpoundCourtRecords"
            label="Reason to impound"
            description="Explain why you want to keep your case private."
          />
          <Banner>
            <p>
              <strong>What do I write?</strong> The court is looking for a legal
              basis to <em>impound</em> (make private) these court records.
              Recommendations:
            </p>
            <ul>
              <li>
                Note how publishing could pose a threat to your privacy or
                safety.
              </li>
              <li>Be as specific to your personal situation as possible.</li>
              <li>
                Note increased rates of violence toward transgender and gender
                non-conforming people.
              </li>
            </ul>
          </Banner>
        </FormSubsection>
      </FormStep>
    );
  },
};
