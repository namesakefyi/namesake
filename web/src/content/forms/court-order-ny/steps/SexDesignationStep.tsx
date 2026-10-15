import { ComboBoxField } from "#components/forms/ComboBoxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsSexDesignationChange } from "../conditions";

export const sexDesignationStep = defineStep({
  id: "sex-designation",
  title: "What is your new sex designation?",
  description:
    "Providing a reason for a sex designation change is optional on this petition.",
  when: requestsSexDesignationChange,
  fields: [
    "newGender",
    "hasPreviouslyFiledSexDesignationChange",
    {
      id: "previouslyFiledSexDesignationChangeDetails",
      when: (data) => data.hasPreviouslyFiledSexDesignationChange === true,
    },
    "isProvidingReasonForGenderChange",
    {
      id: "reasonForGenderChange",
      when: (data) => data.isProvidingReasonForGenderChange === true,
    },
  ],
  component: ({ stepConfig }) => {
    const previousVisible = useFieldVisible(
      stepConfig,
      "previouslyFiledSexDesignationChangeDetails",
    );
    const reasonVisible = useFieldVisible(stepConfig, "reasonForGenderChange");
    return (
      <FormStep stepConfig={stepConfig}>
        <ComboBoxField
          name="newGender"
          label="New sex designation"
          placeholder="Select a sex designation"
          options={[
            { label: "M", value: "M" },
            { label: "F", value: "F" },
            { label: "X", value: "X" },
          ]}
        />
        <YesNoField
          name="hasPreviouslyFiledSexDesignationChange"
          label="Have you ever filed a sex designation change petition before?"
        />
        <FormSubsection isVisible={previousVisible}>
          <LongTextField
            name="previouslyFiledSexDesignationChangeDetails"
            label="Previous petition details"
            description="Include the court, filing date, case number if known, and result."
          />
        </FormSubsection>
        <YesNoField
          name="isProvidingReasonForGenderChange"
          label="Would you like to include your reasons?"
        />
        <FormSubsection isVisible={reasonVisible}>
          <LongTextField
            name="reasonForGenderChange"
            label="Reason for sex designation change"
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
