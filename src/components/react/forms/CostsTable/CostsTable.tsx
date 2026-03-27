import { formatCurrency } from "@/utils/formatCurrency";
import { type Costs, formatTotalCosts } from "@/utils/formatTotalCosts";
import "./CostsTable.css";

interface CostsTableProps {
  costs: Costs;
}

export function CostsTable({ costs }: CostsTableProps) {
  if (!costs || costs.length === 0) {
    return null;
  }

  const totalCosts = formatTotalCosts(costs);

  return (
    <table className="namesake-costs">
      <thead className="visually-hidden">
        <tr>
          <th>Cost</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {costs.map((cost) => (
          <tr key={cost._key}>
            <td>
              {cost.title}
              {cost.required === "notRequired" && " (optional)"}
            </td>
            <td>{formatCurrency(cost.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          <td>{totalCosts}</td>
        </tr>
      </tfoot>
    </table>
  );
}
