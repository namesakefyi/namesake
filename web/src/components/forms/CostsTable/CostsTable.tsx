import type { FormCost } from "#constants/forms";
import { formatCurrency } from "#lib/utils/formatCurrency";
import { formatTotalCosts } from "#lib/utils/formatTotalCosts";
import { useFormStep } from "../FormContainer/FormStepContext";
import "./CostsTable.css";

interface CostsTableProps {
  costs?: readonly FormCost[] | null;
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
          <tr key={cost.title}>
            <td>
              {cost.title}
              {!cost.required && " (optional)"}
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

/** The current form's costs, for use as a `block.display` in a step body. */
export function FormCostsTable() {
  const { costs } = useFormStep();
  return <CostsTable costs={costs ?? []} />;
}
