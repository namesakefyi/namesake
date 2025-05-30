import { Card } from "@/components/common/Card/Card";
import type { Cost } from "@/constants";
import { getTotalCosts } from "@/utils/getTotalCosts";

interface QuestCostsTableProps {
  costs?: Cost[];

  /**
   *
   */
  card?: boolean;
}

export const QuestCostsTable = ({ costs, card }: QuestCostsTableProps) => {
  if (!costs) return null;

  const table = (
    <table className="leading-none [&_tbody_td]:py-1.5 [&_tfoot_td]:pt-3 w-full">
      <thead>
        <tr className="text-sm leading-none text-gray-dim">
          <th className="text-left font-semibold">Cost</th>
          <th className="text-right font-semibold">Amount</th>
        </tr>
      </thead>
      <tbody>
        {costs.map(({ cost, description, isRequired }) => (
          <tr key={description} className="first:[&_td]:pt-3 last:[&_td]:pb-3">
            <td className="pr-4">
              {description}
              {!isRequired && (
                <span className="text-gray-dim italic"> optional</span>
              )}
            </td>
            <td className="text-right tabular-nums">
              {cost.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="font-semibold text-lg leading-none border-t border-gray-dim">
          <td className="pr-4">Total</td>
          <td className="text-right">{getTotalCosts(costs)}</td>
        </tr>
      </tfoot>
    </table>
  );

  if (card) {
    return (
      <Card className="p-4 rounded-lg min-w-48 w-max m-auto">{table}</Card>
    );
  }

  return table;
};
