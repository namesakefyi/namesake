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
  title: "Would you like the court record sealed for your personal safety?",
  description:
    "The clerk will temporarily keep your name and case information private until the judge makes a final decision. You can also ask the court to seal the record for your personal safety.",
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
