import type { Cost } from "@convex/constants";
import { Fragment } from "react/jsx-runtime";
import { StatGroup, StatPopover } from "../StatGroup/StatGroup";

type QuestCostsProps = {
  costs?: Cost[];
};

export const QuestCosts = ({ costs }: QuestCostsProps) => {
  const getTotalCosts = (costs?: Cost[]) => {
    if (!costs) return "Free";

    const total = costs.reduce((acc, cost) => acc + cost.cost, 0);
    return total > 0
      ? total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })
      : "Free";
  };

  return (
    <StatGroup label="Cost" value={getTotalCosts(costs)}>
      {costs?.length && (
        <StatPopover tooltip="See cost breakdown">
          <dl className="grid grid-cols-[1fr_auto]">
            {costs.map(({ cost, description }) => (
              <Fragment key={description}>
                <dt className="text-gray-dim pr-4">{description}</dt>
                <dd className="text-right">
                  {cost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </Fragment>
            ))}
            <dt className="text-gray-dim pr-4 border-t border-gray-dim pt-2 mt-2">
              Total
            </dt>
            <dd className="text-right border-t border-gray-dim pt-2 mt-2">
              {getTotalCosts(costs)}
            </dd>
          </dl>
        </StatPopover>
      )}
    </StatGroup>
  );
};
