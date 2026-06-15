import { useFormContext } from "react-hook-form";
import { CheckboxField } from "~/components/forms/CheckboxField";
import { FormStep, FormSubsection } from "~/components/forms/FormStep";
import { NumberField } from "~/components/forms/NumberField";
import { ShortTextField } from "~/components/forms/ShortTextField";
import { defineStep } from "~/forms/defineStep";

const amountProps = {
  label: "Amount (if known)",
  minValue: 0,
  formatOptions: {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  },
} as const;

export const extraFeesStep = defineStep({
  id: "extra-fees",
  title: "Do you need any other costs waived?",
  description:
    "These are rare for name changes. If none apply, you can skip this step.",
  fields: [
    "shouldWaiveExpertServices",
    {
      ids: ["costOfExpertServices", "expertServicesDetails"],
      when: (data) => data.shouldWaiveExpertServices === true,
    },
    "shouldWaiveCostOfTranscription",
    {
      id: "costOfTranscription",
      when: (data) => data.shouldWaiveCostOfTranscription === true,
    },
    "shouldWaiveRecordingOfTrialForAppeal",
    "shouldWaiveAppealBond",
    "shouldWaiveCostOfWrittenTranscriptPreparation",
    {
      id: "costOfWrittenTranscriptPreparation",
      when: (data) =>
        data.shouldWaiveCostOfWrittenTranscriptPreparation === true,
    },
    "shouldWaiveOtherFeesSection3",
    {
      ids: ["otherFeesSection3", "otherFeesSection3Details"],
      when: (data) => data.shouldWaiveOtherFeesSection3 === true,
    },
    "applySubstitutionSection3",
    {
      id: "substitutionDetailsSection3",
      when: (data) => data.applySubstitutionSection3 === true,
    },
  ],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const waiveExpert = form.watch("shouldWaiveExpertServices");
    const waiveTranscription = form.watch("shouldWaiveCostOfTranscription");
    const waiveWrittenTranscript = form.watch(
      "shouldWaiveCostOfWrittenTranscriptPreparation",
    );
    const waiveOther = form.watch("shouldWaiveOtherFeesSection3");
    const applySubstitution = form.watch("applySubstitutionSection3");

    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="shouldWaiveExpertServices"
          label="Expert services for testing, examination, testimony, or other assistance"
        />
        <FormSubsection isVisible={waiveExpert === true}>
          <NumberField name="costOfExpertServices" {...amountProps} />
          <ShortTextField
            name="expertServicesDetails"
            label="Describe the expert services needed"
          />
        </FormSubsection>
        <CheckboxField
          name="shouldWaiveCostOfTranscription"
          label="Taking and/or transcribing a deposition"
        />
        <FormSubsection isVisible={waiveTranscription === true}>
          <NumberField name="costOfTranscription" {...amountProps} />
        </FormSubsection>
        <CheckboxField
          name="shouldWaiveRecordingOfTrialForAppeal"
          label="Recording of trial for appeal (if you don't have a public defender)"
        />
        <CheckboxField name="shouldWaiveAppealBond" label="Appeal bond" />
        <CheckboxField
          name="shouldWaiveCostOfWrittenTranscriptPreparation"
          label="Preparing a written transcript of trial or other proceeding"
        />
        <FormSubsection isVisible={waiveWrittenTranscript === true}>
          <NumberField
            name="costOfWrittenTranscriptPreparation"
            {...amountProps}
          />
        </FormSubsection>
        <CheckboxField
          name="shouldWaiveOtherFeesSection3"
          label="Other extra fees or costs"
        />
        <FormSubsection isVisible={waiveOther === true}>
          <NumberField name="otherFeesSection3" {...amountProps} />
          <ShortTextField
            name="otherFeesSection3Details"
            label="What are these fees for?"
          />
        </FormSubsection>
        <CheckboxField
          name="applySubstitutionSection3"
          label="Ask the court to substitute one of these costs with a free or lower-cost alternative"
        />
        <FormSubsection isVisible={applySubstitution === true}>
          <ShortTextField
            name="substitutionDetailsSection3"
            label="Describe the substitution"
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
