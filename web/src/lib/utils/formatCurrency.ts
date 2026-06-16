export const formatCurrency = (cost?: number | null) => {
  const fractionDigits = Number.isInteger(cost) ? 0 : 2;

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(cost ?? 0);
};
