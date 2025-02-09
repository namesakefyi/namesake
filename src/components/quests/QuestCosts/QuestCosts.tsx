import { Button, Tooltip, TooltipTrigger } from "@/components/common";
import {
  EditQuestCostsModal,
  StatGroup,
  StatPopover,
} from "@/components/quests";
import type { Doc } from "@convex/_generated/dataModel";
import type { Cost } from "@convex/constants";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

type QuestCostsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestCosts = ({ quest, editable = false }: QuestCostsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (quest === undefined) return null;

  const { costs } = quest;

  const getTotalCosts = (costs?: Cost[]) => {
    if (!costs || costs.length === 0) return "Free";

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
      {costs && costs.length > 0 && (
        <StatPopover tooltip="See cost breakdown">
          <dl className="grid grid-cols-[1fr_auto]">
            {costs.map(({ cost, description }) => (
              <Fragment key={description}>
                <dt className="text-gray-dim pr-4">{description}</dt>
                <dd className="text-right tabular-nums">
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
      {editable && (
        <>
          <TooltipTrigger>
            <Button
              variant="icon"
              size="small"
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              aria-label="Edit costs"
            />
            <Tooltip>Edit costs</Tooltip>
          </TooltipTrigger>
          <EditQuestCostsModal
            quest={quest}
            open={isEditing}
            onOpenChange={setIsEditing}
          />
        </>
      )}
    </StatGroup>
  );
};
