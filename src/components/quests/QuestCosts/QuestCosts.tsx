import {
  Badge,
  BadgeButton,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { EditQuestCostsModal } from "@/components/quests";
import type { Doc } from "@convex/_generated/dataModel";
import type { Cost } from "@convex/constants";
import { HelpCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

type QuestCostsProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestCosts = ({ quest, editable = false }: QuestCostsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!quest) return null;

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
    <Badge>
      {getTotalCosts(costs)}
      {costs && costs.length > 0 && (
        <TooltipTrigger>
          <BadgeButton label="Cost details" icon={HelpCircle} />
          <Tooltip>
            <dl className="grid grid-cols-[1fr_auto] py-1">
              {costs.map(({ cost, description }) => (
                <Fragment key={description}>
                  <dt className="pr-4">{description}</dt>
                  <dd className="text-right tabular-nums">
                    {cost.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </dd>
                </Fragment>
              ))}
              <dt className="pr-4 border-t border-gray-a5 pt-2 mt-2">Total</dt>
              <dd className="text-right border-t border-gray-a5 pt-2 mt-2">
                {getTotalCosts(costs)}
              </dd>
            </dl>
          </Tooltip>
        </TooltipTrigger>
      )}
      {editable && (
        <>
          <TooltipTrigger>
            <BadgeButton
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              label="Edit costs"
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
    </Badge>
  );
};
