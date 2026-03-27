export const formatCurrency = (cost?: number | null) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cost ?? 0);
};
