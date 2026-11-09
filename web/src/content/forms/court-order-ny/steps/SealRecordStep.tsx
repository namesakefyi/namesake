import { Banner } from "#components/common/Banner";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

export const sealRecordStep = defineStep({
  id: "seal-record",
  title: "Would you like your court record sealed?",
  description:
    "Your case is automatically kept private until the judge makes a decision. If public access to your record could put your safety at risk, you can ask the court to keep it sealed after that, too.",
  fields: [
    "shouldSealCourtRecord",
    {
      id: "reasonToSealCourtRecord",
      when: (data) => data.shouldSealCourtRecord === true,
    },
  ],
  component: ({ stepConfig }) => {
    const reasonVisible = useFieldVisible(
      stepConfig,
      "reasonToSealCourtRecord",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="shouldSealCourtRecord"
          label="Should this court record be sealed for your personal safety?"
          labelHidden
          yesLabel="Yes, ask the court to keep my record sealed"
          noLabel="No, it’s okay for my record to be public after the decision"
        />
        <FormSubsection isVisible={reasonVisible}>
          <LongTextField
            name="reasonToSealCourtRecord"
            label="Reason to seal the court record"
            description="Explain why you want to keep your case private."
          />
          <Banner>
            <p>
              <strong>What do I write?</strong> Explain how public access to
              your court record could affect your personal safety.
            </p>
            <ul>
              <li>
                Describe the privacy or safety concerns that apply to you.
              </li>
              <li>Be as specific to your personal situation as possible.</li>
            </ul>
          </Banner>
        </FormSubsection>
      </FormStep>
    );
  },
});
