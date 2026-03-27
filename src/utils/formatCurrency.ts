export const formatCurrency = (cost?: number | null) => {
  if (!cost) return null;

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cost);
};
