import type { Cost } from "@/constants/quests";

export const getTotalCosts = (costs?: Cost[]) => {
  if (!costs || costs.length === 0) return "Free";

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const requiredTotal = costs
    .filter((cost) => cost.isRequired !== false)
    .reduce((acc, cost) => acc + cost.cost, 0);

  const totalWithOptional = costs.reduce((acc, cost) => acc + cost.cost, 0);

  if (requiredTotal === 0) {
    return "Free";
  }

  if (requiredTotal === totalWithOptional) {
    return formatCurrency(requiredTotal);
  }

  return `${formatCurrency(requiredTotal)}–${formatCurrency(totalWithOptional)}`;
};
