import type { FormCost } from "#constants/forms";
import { formatCurrency } from "./formatCurrency";

export type { FormCost as Cost };

/**
 * Given a form's costs, return the total as a string, accounting for
 * optional costs and free forms.
 *
 * @example
 * formatTotalCosts([{ title: "Filing fee", amount: 50, required: "required" }])
 * // "$50"
 * formatTotalCosts([
 *   { title: "Filing fee", amount: 50, required: "required" },
 *   { title: "Certified copy", amount: 25, required: "notRequired" },
 * ])
 * // "$50–$75"
 * formatTotalCosts([])
 * // "Free"
 */
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
