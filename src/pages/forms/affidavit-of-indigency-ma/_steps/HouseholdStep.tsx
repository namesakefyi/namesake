import { FormStep } from "../../../../components/forms/FormStep";
import { NumberField } from "../../../../components/forms/NumberField";
import type { Step } from "../../../../forms/types";

export const householdStep: Step = {
  id: "household",
  title: "How many people are in your household?",
  description: "Include yourself and anyone you financially support.",
  when: (data) => data.indigencyBasis === "income",
  fields: ["householdSize", "numberOfDependents", "otherHouseholdIncome"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NumberField
        name="householdSize"
        label="Total number of people in your household"
        minValue={1}
      />
      <NumberField
        name="numberOfDependents"
        label="Number of dependents"
        minValue={0}
      />
      <NumberField
        name="otherHouseholdIncome"
        label="Other household income (optional)"
        description="Any other income available to your household for the same period you entered above"
        minValue={0}
        defaultValue={0}
        formatOptions={{
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }}
      />
    </FormStep>
  ),
};
