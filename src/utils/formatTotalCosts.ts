import type { FormCost } from "../constants/forms";
import { formatCurrency } from "./formatCurrency";

export type { FormCost as Cost };

export const formatTotalCosts = (costs?: readonly FormCost[] | null) => {
  if (!costs || costs.length === 0) return "Free";

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
