import { formatCurrency } from "@/utils/formatCurrency";
import {
  type Costs as CostsType,
  formatTotalCosts,
} from "@/utils/formatTotalCosts";
import "./Costs.css";

interface CostsProps {
  costs: CostsType;
}

export function Costs({ costs }: CostsProps) {
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
          <tr key={cost.title}>
            <td>
              {cost.title}
              {cost.required === "notRequired" && " (optional)"}
            </td>
            <td>{formatCurrency(cost.amount ?? 0)}</td>
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
