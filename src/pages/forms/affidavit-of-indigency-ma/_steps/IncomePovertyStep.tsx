import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { NumberField } from "../../../../components/forms/NumberField";
import { RadioGroupField } from "../../../../components/forms/RadioGroupField";
import type { Step } from "../../../../forms/types";
import type { PovertyGuideline } from "../../../../utils/fetchPovertyGuideline";
import { fetchPovertyGuideline } from "../../../../utils/fetchPovertyGuideline";
import "./IncomePovertyStep.css";

export const INCOME_MULTIPLIERS: Record<string, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  yearly: 1,
};

export function derivePovertyComparison(
  annualIncome: number,
  threshold: number,
): "equal" | "below" | "above" {
  if (annualIncome === threshold) return "equal";
  if (annualIncome < threshold) return "below";
  return "above";
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function PovertyResult({
  householdSize,
  income,
  incomePeriod,
}: {
  householdSize: number;
  income: number | undefined;
  incomePeriod: string | undefined;
}) {
  const [guideline, setGuideline] = useState<PovertyGuideline | null>(null);
  const [loading, setLoading] = useState(false);

  const effectiveSize = householdSize > 8 ? 8 : householdSize;

  useEffect(() => {
    if (!effectiveSize || effectiveSize < 1) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      fetchPovertyGuideline(new Date().getFullYear(), effectiveSize).then(
        (data) => {
          if (!cancelled) {
            setGuideline(data);
            setLoading(false);
          }
        },
      );
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [effectiveSize]);

  if (!householdSize || householdSize < 1 || (!loading && !guideline)) {
    return null;
  }

  if (!guideline) {
    return (
      <p className="poverty-result-loading" aria-busy="true">
        Loading poverty guideline…
      </p>
    );
  }

  const threshold = guideline.povertyThreshold;
  const householdLabel =
    householdSize > 8 ? "8 or more" : String(guideline.householdSize);

  const annualIncome =
    income != null && incomePeriod
      ? income * (INCOME_MULTIPLIERS[incomePeriod] ?? 1)
      : null;
  const comparison =
    annualIncome != null
      ? derivePovertyComparison(annualIncome, threshold)
      : null;
  const qualifies = comparison === "equal" || comparison === "below";

  return (
    <>
      <div aria-busy={loading}>
        <p>
          The {guideline.year} federal poverty guideline for a household of{" "}
          <strong
            className={loading ? "poverty-result-dynamic-loading" : undefined}
          >
            {householdLabel}
          </strong>{" "}
          is{" "}
          <strong
            className={loading ? "poverty-result-dynamic-loading" : undefined}
          >
            {formatCurrency(threshold)}/year
          </strong>
          .
        </p>
        {annualIncome != null && (
          <p className={qualifies ? undefined : "poverty-result-above"}>
            Your annualized income of{" "}
            <strong>{formatCurrency(annualIncome)}</strong> is{" "}
            <strong>
              {comparison === "equal"
                ? "at or below"
                : comparison === "below"
                  ? "below"
                  : "above"}
            </strong>{" "}
            this threshold.
          </p>
        )}
        <small>
          <a
            href="https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines"
            target="_blank"
            rel="noopener noreferrer"
          >
            View the federal poverty guidelines
          </a>
        </small>
      </div>
      {qualifies === false && (
        <Banner variant="warning">
          You may still qualify for a fee waiver if paying court fees would mean
          going without food, shelter, or clothing. Go back and select{" "}
          <strong>
            "I cannot pay without depriving myself or my dependents of
            necessities"
          </strong>{" "}
          instead. Alternatively, you can request assistance from the
          Massachusetts Transgender Political Coalition's{" "}
          <a
            href="https://www.masstpc.org/what-we-do/ida-network/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Identity Document Assistance
          </a>{" "}
          network.
        </Banner>
      )}
    </>
  );
}

export const incomePovertyStep: Step = {
  id: "income-poverty",
  title: "What is your income after taxes?",
  description:
    "We'll use this along with your household size to check whether your income is at or below the federal poverty level.",
  when: (data) => data.indigencyBasis === "income",
  fields: [
    "incomeAmount",
    "incomePeriod",
    "householdSize",
    "numberOfDependents",
    "otherHouseholdIncome",
  ],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const incomeAmount = form.watch("incomeAmount");
    const incomePeriod = form.watch("incomePeriod");
    const householdSize = form.watch("householdSize");

    return (
      <FormStep stepConfig={stepConfig}>
        <NumberField
          name="incomeAmount"
          label="Income amount, after taxes"
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
            { label: "Weekly", value: "weekly" },
            { label: "Biweekly (every two weeks)", value: "biweekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
        <NumberField
          name="householdSize"
          label="Total number of people in your household"
          minValue={1}
        />
        <PovertyResult
          householdSize={Number(householdSize) || 0}
          income={incomeAmount !== "" ? Number(incomeAmount) : undefined}
          incomePeriod={incomePeriod || undefined}
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
    );
  },
};
