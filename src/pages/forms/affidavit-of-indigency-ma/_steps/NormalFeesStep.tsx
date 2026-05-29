import { useFormContext } from "react-hook-form";
import { CheckboxField } from "../../../../components/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
} from "../../../../components/forms/FormStep";
import { NumberField } from "../../../../components/forms/NumberField";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import type { Step } from "../../../../forms/types";

const amountProps = {
  label: "Amount (if known)",
  minValue: 0,
  formatOptions: {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  },
} as const;

export const normalFeesStep: Step = {
  id: "normal-fees",
  title: "Which court fees would you like waived?",
  description: "Check all that apply. Enter the amount if you know it.",
  fields: [
    "shouldWaiveFilingFeeAndSurcharge",
    {
      id: "filingFeeAndSurcharge",
      when: (data) => data.shouldWaiveFilingFeeAndSurcharge === true,
    },
    "shouldWaiveFilingFeeAndSurchargeForAppeal",
    {
      id: "filingFeeAndSurchargeForAppeal",
      when: (data) => data.shouldWaiveFilingFeeAndSurchargeForAppeal === true,
    },
    "shouldWaiveFeesForCourtSummons",
    {
      id: "feesForCourtSummons",
      when: (data) => data.shouldWaiveFeesForCourtSummons === true,
    },
    "shouldWaiveOtherFeesSection2",
    {
      ids: ["otherFeesSection2", "otherFeesSection2Details"],
      when: (data) => data.shouldWaiveOtherFeesSection2 === true,
    },
    "applySubstitutionSection2",
    {
      id: "substitutionDetailsSection2",
      when: (data) => data.applySubstitutionSection2 === true,
    },
  ],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const waiveFilingFee = form.watch("shouldWaiveFilingFeeAndSurcharge");
    const waiveAppealFee = form.watch(
      "shouldWaiveFilingFeeAndSurchargeForAppeal",
    );
    const waiveSummons = form.watch("shouldWaiveFeesForCourtSummons");
    const waiveOther = form.watch("shouldWaiveOtherFeesSection2");
    const applySubstitution = form.watch("applySubstitutionSection2");

    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="shouldWaiveFilingFeeAndSurcharge"
          label="Filing fee and any surcharge"
        />
        <FormSubsection isVisible={waiveFilingFee === true}>
          <NumberField name="filingFeeAndSurcharge" {...amountProps} />
        </FormSubsection>

        <CheckboxField
          name="shouldWaiveFilingFeeAndSurchargeForAppeal"
          label="Filing fee and any surcharge for appeal"
        />
        <FormSubsection isVisible={waiveAppealFee === true}>
          <NumberField name="filingFeeAndSurchargeForAppeal" {...amountProps} />
        </FormSubsection>

        <CheckboxField
          name="shouldWaiveFeesForCourtSummons"
          label="Fees or costs for serving court summons, witness subpoenas, or other court papers"
        />
        <FormSubsection isVisible={waiveSummons === true}>
          <NumberField name="feesForCourtSummons" {...amountProps} />
        </FormSubsection>

        <CheckboxField
          name="shouldWaiveOtherFeesSection2"
          label="Other fees or costs"
        />
        <FormSubsection isVisible={waiveOther === true}>
          <NumberField name="otherFeesSection2" {...amountProps} />
          <ShortTextField
            name="otherFeesSection2Details"
            label="What are these fees for?"
          />
        </FormSubsection>

        <CheckboxField
          name="applySubstitutionSection2"
          label="Substitution of a document, service, or object at no cost or lower cost paid by the state"
        />
        <FormSubsection isVisible={applySubstitution === true}>
          <ShortTextField
            name="substitutionDetailsSection2"
            label="Describe the substitution"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
