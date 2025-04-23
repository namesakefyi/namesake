import {
  Badge,
  BadgeButton,
  Button,
  Form,
  Modal,
  ModalHeader,
  NumberField,
  Switch,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import type { Cost } from "@convex/constants";
import { useMutation } from "convex/react";
import { HelpCircle, Pencil } from "lucide-react";
import { Plus, Trash } from "lucide-react";
import { memo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

type CostInputProps = {
  cost: Cost;
  onChange: (cost: Cost) => void;
  onRemove: (cost: Cost) => void;
};

const CostInput = memo(function CostInput({
  cost,
  onChange,
  onRemove,
}: CostInputProps) {
  return (
    <div className="flex items-start gap-2">
      <NumberField
        aria-label="Cost"
        className="w-24"
        prefix="$"
        value={cost.cost}
        onChange={(value) =>
          onChange({ cost: value, description: cost.description })
        }
        minValue={0}
        maxValue={2000}
        isRequired
      />
      <TextField
        aria-label="For"
        className="flex-1"
        value={cost.description}
        onChange={(value) => onChange({ cost: cost.cost, description: value })}
        isRequired
        maxLength={32}
      />
      <Button
        type="button"
        variant="secondary"
        onPress={() => onRemove(cost)}
        icon={Trash}
        aria-label="Remove"
      />
    </div>
  );
});

type EditCostsModalProps = {
  quest: Doc<"quests">;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const EditQuestCostsModal = ({
  quest,
  open,
  onOpenChange,
}: EditCostsModalProps) => {
  const [costsInput, setCostsInput] = useState(quest.costs ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setCosts = useMutation(api.quests.setCosts);

  const handleCancel = () => {
    setCostsInput(quest.costs ?? null);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setCosts({ costs: costsInput ?? undefined, questId: quest._id })
      .then(() => {
        toast.success("Updated costs");
        onOpenChange(false);
      })
      .catch(() => {
        toast.error("Failed to update costs");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal isOpen={open}>
      <Form onSubmit={handleSubmit} className="w-full">
        <ModalHeader title="Edit costs">
          <Switch
            isSelected={!costsInput}
            onChange={(isSelected) =>
              setCostsInput(isSelected ? null : [{ cost: 0, description: "" }])
            }
            className="justify-self-start"
          >
            Free
          </Switch>
        </ModalHeader>

        {costsInput && (
          <div className="flex flex-col gap-2 w-full">
            {costsInput.map((cost, index) => (
              <CostInput
                // biome-ignore lint/suspicious/noArrayIndexKey:
                key={index}
                cost={cost}
                onChange={(value) => {
                  const newCosts = [...costsInput];
                  newCosts[index] = value;
                  setCostsInput(newCosts);
                }}
                onRemove={() => {
                  setCostsInput(costsInput.filter((_, i) => i !== index));
                }}
              />
            ))}
            <Button
              type="button"
              onPress={() =>
                setCostsInput([
                  ...(costsInput ?? []),
                  { cost: 0, description: "" },
                ])
              }
              icon={Plus}
            >
              Add cost
            </Button>
          </div>
        )}
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onPress={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

type QuestCostsBadgeProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestCostsBadge = ({
  quest,
  editable = false,
}: QuestCostsBadgeProps) => {
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
