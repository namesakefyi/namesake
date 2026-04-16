import type { Get } from "@sanity/codegen";
import type { Guide } from "../sanity/sanity.types";

type GuideCostsField = Get<Guide, "costs">;

export type Cost = NonNullable<GuideCostsField>[number];

export type Costs = GuideCostsField | null;

export const formatTotalCosts = (costs?: Costs) => {
  if (!costs || costs.length === 0) return "Free";

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const requiredTotal = costs
    .filter((cost) => cost.required !== "notRequired")
    .reduce((acc, cost) => acc + (cost.amount ?? 0), 0);

  const totalWithOptional = costs.reduce(
    (acc, cost) => acc + (cost.amount ?? 0),
    0,
  );

  if (requiredTotal === 0) {
    return "Free";
  }

  if (requiredTotal === totalWithOptional) {
    return formatCurrency(requiredTotal);
  }

  return `${formatCurrency(requiredTotal)}–${formatCurrency(totalWithOptional)}`;
};
