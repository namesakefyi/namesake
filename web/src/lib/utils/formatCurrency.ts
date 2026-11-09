/**
 * Given a cost, return the U.S. dollar amount,
 * with cents if cost includes a fractional amount.
 *
 * @example
 * formatCurrency(50)
 * // "$50"
 * formatCurrency(29.95)
 * // "$29.95"
 */
const formatters = [0, 2].map(
  (fractionDigits) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }),
);

export const formatCurrency = (cost?: number | null) =>
  formatters[Number.isInteger(cost) ? 0 : 1].format(cost ?? 0);
