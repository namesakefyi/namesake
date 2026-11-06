import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const courtCasesStep = defineStep({
  id: "court-cases",
  title:
    "Do you have any bankruptcy filings, judgments, liens, or court cases?",
  when: requestsNameChange,
  fields: [
    "hasFiledForBankruptcy",
    "hasJudgmentsOrLiens",
    "isPartyToLawsuitOrCourtCase",
    {
      id: "bankruptcyJudgmentsLiensDetails",
      when: (data) =>
        data.hasFiledForBankruptcy === true ||
        data.hasJudgmentsOrLiens === true ||
        data.isPartyToLawsuitOrCourtCase === true,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "bankruptcyJudgmentsLiensDetails",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasFiledForBankruptcy"
          label="Have you ever filed for bankruptcy?"
        />
        <YesNoField
          name="hasJudgmentsOrLiens"
          label="Are there any judgments or liens against you?"
        />
        <YesNoField
          name="isPartyToLawsuitOrCourtCase"
          label="Are you a party in a lawsuit or other court case?"
        />
        <FormSubsection isVisible={detailsVisible}>
          <LongTextField
            name="bankruptcyJudgmentsLiensDetails"
            label="Case details"
            description="Include the court, filing date, and case number, if known."
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
