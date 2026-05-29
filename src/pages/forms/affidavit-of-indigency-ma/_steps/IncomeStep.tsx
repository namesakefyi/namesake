import { FormStep } from "../../../../components/forms/FormStep";
import { NumberField } from "../../../../components/forms/NumberField";
import { RadioGroupField } from "../../../../components/forms/RadioGroupField";
import type { Step } from "../../../../forms/types";

export const incomeStep: Step = {
  id: "income",
  title: "What is your income after taxes?",
  description:
    "Enter the amount you take home after taxes are deducted from your pay.",
  when: (data) => data.indigencyBasis === "income",
  fields: ["incomeAmount", "incomePeriod"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NumberField
        name="incomeAmount"
        label="Income amount"
        minValue={0}
        formatOptions={{
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }}
      />
      <RadioGroupField
        name="incomePeriod"
        label="How often do you receive this income?"
        options={[
          { label: "Weekly", value: "per-week" },
          { label: "Biweekly (every two weeks)", value: "biweekly" },
          { label: "Monthly", value: "per-month" },
          { label: "Yearly", value: "per-year" },
        ]}
      />
    </FormStep>
  ),
};
