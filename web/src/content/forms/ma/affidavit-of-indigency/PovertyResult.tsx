import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Banner } from "#components/common/Banner";
import type { PovertyGuideline } from "#lib/utils/fetchPovertyGuideline";
import { fetchPovertyGuideline } from "#lib/utils/fetchPovertyGuideline";
import { formatCurrency } from "#lib/utils/formatCurrency";
import "./PovertyResult.css";

export const MTPC_ASSISTANCE_URL =
  "https://www.masstpc.org/what-we-do/ida-network/";

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

export function PovertyResult() {
  const [incomeAmount, incomePeriod, rawHouseholdSize] = useWatch({
    name: ["incomeAmount", "incomePeriod", "householdSize"],
  });
  const householdSize = Number(rawHouseholdSize) || 0;
  const income =
    incomeAmount != null && incomeAmount !== ""
      ? Number(incomeAmount)
      : undefined;
  const [guideline, setGuideline] = useState<PovertyGuideline | null>(null);
  const [loading, setLoading] = useState(false);

  const effectiveSize = Math.min(householdSize, 8);

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
  const isAbove = comparison === "above";

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
            {formatCurrency(Math.round(threshold))}/year
          </strong>
          .
        </p>
        {annualIncome != null && (
          <p className={isAbove ? "poverty-result-above" : undefined}>
            Your annualized income of{" "}
            <strong>{formatCurrency(Math.round(annualIncome))}</strong> is{" "}
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
      {isAbove && (
        <Banner variant="warning">
          You may still qualify for a fee waiver if paying court fees would mean
          going without food, shelter, or clothing. Go back and select{" "}
          <strong>
            "I cannot pay without depriving myself or my dependents of food,
            shelter, or clothing"
          </strong>{" "}
          instead. Alternatively, you can request assistance from the
          Massachusetts Transgender Political Coalition's{" "}
          <a
            href={MTPC_ASSISTANCE_URL}
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
