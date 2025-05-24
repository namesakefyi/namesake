import {
  Badge,
  BadgeButton,
  Button,
  DialogTrigger,
  Form,
  NumberField,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { type Cost, DEFAULT_COSTS } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { CircleDollarSign, CircleOff, HelpCircle, Pencil } from "lucide-react";
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
    <div className="flex items-start gap-2 w-full">
      <NumberField
        aria-label="Cost"
        className="w-20"
        prefix="$"
        value={cost.cost}
        onChange={(value) =>
          onChange({
            ...cost,
            cost: value,
          })
        }
        minValue={0}
        maxValue={2000}
        isRequired
      />
      <TextField
        aria-label="For"
        className="flex-1 min-w-0"
        placeholder="Description"
        value={cost.description}
        onChange={(value) =>
          onChange({
            ...cost,
            description: value,
          })
        }
        isRequired
        maxLength={32}
      />
      <ToggleButtonGroup
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={cost.isRequired ? ["required"] : ["optional"]}
        onSelectionChange={(keys) =>
          onChange({
            ...cost,
            isRequired: keys.has("required"),
          })
        }
      >
        <TooltipTrigger>
          <ToggleButton
            id="required"
            icon={CircleDollarSign}
            aria-label="Required cost"
          />
          <Tooltip>Required cost</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ToggleButton
            id="optional"
            icon={CircleOff}
            aria-label="Optional cost"
          />
          <Tooltip>Optional cost</Tooltip>
        </TooltipTrigger>
      </ToggleButtonGroup>
      <TooltipTrigger>
        <Button
          type="button"
          variant="secondary"
          onPress={() => onRemove(cost)}
          icon={Trash}
          aria-label="Remove"
        />
        <Tooltip>Remove cost</Tooltip>
      </TooltipTrigger>
    </div>
  );
});

type QuestCostsBadgeProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestCostsBadge = ({
  quest,
  editable = false,
}: QuestCostsBadgeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [costsInput, setCostsInput] = useState(quest?.costs ?? DEFAULT_COSTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setCosts = useMutation(api.quests.setCosts);

  if (!quest) return null;

  const handleDelete = () => {
    setCosts({ costs: undefined, questId: quest._id });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCostsInput(quest.costs ?? DEFAULT_COSTS);
    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await setCosts({ costs: costsInput ?? undefined, questId: quest._id });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update costs");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { costs } = quest;

  const getTotalCosts = (costs?: Cost[]) => {
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

  if (!costs && !editable) return null;

  return (
    <Badge size="lg">
      {costs ? getTotalCosts(costs) : "Add costs"}
      {costs && costs.length > 0 && (
        <DialogTrigger>
          <TooltipTrigger>
            <BadgeButton label="Cost details" icon={HelpCircle} />
            <Tooltip>See cost details</Tooltip>
          </TooltipTrigger>
          <Popover placement="bottom" className="py-3 px-3.5">
            <dl className="grid grid-cols-[1fr_auto]">
              {costs.map(({ cost, description, isRequired }) => (
                <Fragment key={description}>
                  <dt className="pr-4">
                    {description}
                    {!isRequired && (
                      <span className="text-gray-dim italic"> optional</span>
                    )}
                  </dt>
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
          </Popover>
        </DialogTrigger>
      )}
      {editable && (
        <DialogTrigger>
          <TooltipTrigger>
            <BadgeButton
              icon={costs ? Pencil : Plus}
              onPress={() => setIsEditing(true)}
              label={costs ? "Edit costs" : "Add costs"}
            />
            <Tooltip>{costs ? "Edit costs" : "Add costs"}</Tooltip>
          </TooltipTrigger>
          <Popover isOpen={isEditing} className="p-4 w-full max-w-md">
            <Form onSubmit={handleSubmit} className="w-full">
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
                    size="small"
                    onPress={() =>
                      setCostsInput([
                        ...(costsInput ?? []),
                        { cost: 0, description: "", isRequired: true },
                      ])
                    }
                    icon={Plus}
                  >
                    Add cost
                  </Button>
                </div>
              )}
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  onPress={handleDelete}
                  className="mr-auto"
                >
                  Remove
                </Button>
                <Button variant="secondary" size="small" onPress={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  isSubmitting={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </Form>
          </Popover>
        </DialogTrigger>
      )}
    </Badge>
  );
};
