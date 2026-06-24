/**
 * @returns The U.S. dollar amount, with cents if cost includes a fractional amount.
 *
 * @example
 * formatCurrency(50)
 * // "$50"
 * formatCurrency(29.95)
 * // "$29.95"
 */
export const formatCurrency = (cost?: number | null) => {
  const fractionDigits = Number.isInteger(cost) ? 0 : 2;

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(cost ?? 0);
};
