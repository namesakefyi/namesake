import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const consentStep: Step = {
  id: "consent",
  title: "Does everyone consent to the name change?",
  fields: [
    "isParent1Assenting",
    {
      id: "parent1DissentReason",
      when: (data) => data.isParent1Assenting === false,
    },
    "isParent2Assenting",
    {
      id: "parent2DissentReason",
      when: (data) => data.isParent2Assenting === false,
    },
    {
      id: "hasCourtAppointedGuardian",
      when: (data) => data.hasCourtAppointedGuardian === true,
    },
    "isAllGuardiansAssenting",
    {
      id: "guardianDissentReason",
      when: (data) => data.isAllGuardiansAssenting === false,
    },
  ],
  component: ({ stepConfig }) => {
    const parent1DissentVisible = useFieldVisible(
      stepConfig,
      "parent1DissentReason",
    );
    const parent2DissentVisible = useFieldVisible(
      stepConfig,
      "parent2DissentReason",
    );
    const guardianVisible = useFieldVisible(
      stepConfig,
      "hasCourtAppointedGuardian",
    );
    const guardianDissentVisible = useFieldVisible(
      stepConfig,
      "guardianDissentReason",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isParent1Assenting"
          label="Does parent 1 consent to the name change?"
        />
        <FormSubsection isVisible={parent1DissentVisible}>
          <LongTextField name="parent1DissentReason" label="Reason" />
        </FormSubsection>
        <YesNoField
          name="isParent2Assenting"
          label="Does parent 2 consent to the name change?"
        />
        <FormSubsection isVisible={parent2DissentVisible}>
          <LongTextField name="parent2DissentReason" label="Reason" />
        </FormSubsection>
        {guardianVisible && (
          <>
            <YesNoField
              name="isAllGuardiansAssenting"
              label="Do all court-appointed guardians consent to the name change?"
            />
            <FormSubsection isVisible={guardianDissentVisible}>
              <LongTextField name="guardianDissentReason" label="Reason" />
            </FormSubsection>
          </>
        )}
      </FormStep>
    );
  },
};
