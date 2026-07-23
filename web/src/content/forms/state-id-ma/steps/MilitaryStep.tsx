import { CheckboxField } from "#components/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";

const whenMilitary = (data: Record<string, unknown>) =>
  data.isActiveDutyMilitary === true || data.isVeteran === true;

const whenVeteran = (data: Record<string, unknown>) => data.isVeteran === true;

export const militaryStep = defineStep({
  id: "military-status",
  title: "What is your military status?",
  description:
    "Leave both boxes unchecked if neither applies. Documentation is required for any military status you select.",
  fields: [
    "isActiveDutyMilitary",
    "isVeteran",
    { id: "shouldAddVeteranDesignation", when: whenVeteran },
    { id: "militaryBranch", when: whenMilitary },
  ],
  component: ({ stepConfig }) => {
    const veteranDesignationVisible = useFieldVisible(
      stepConfig,
      "shouldAddVeteranDesignation",
    );
    const militaryBranchVisible = useFieldVisible(stepConfig, "militaryBranch");

    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="isActiveDutyMilitary"
          label="I am an active-duty member"
        />
        <CheckboxField name="isVeteran" label="I am a veteran" />
        <FormSubsection isVisible={veteranDesignationVisible}>
          <CheckboxField
            name="shouldAddVeteranDesignation"
            label='Print the word "VETERAN" on my ID'
          />
        </FormSubsection>
        <FormSubsection isVisible={militaryBranchVisible}>
          <ShortTextField
            name="militaryBranch"
            label="Military branch"
            size={24}
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
