import {
  Badge,
  Button,
  Container,
  DialogTrigger,
  Empty,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  PageHeader,
  Popover,
  StatusSelect,
  Tooltip,
  TooltipTrigger,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { Status } from "@convex/constants";
import {
  RiLink,
  RiMoreFill,
  RiQuestionLine,
  RiSignpostLine,
} from "@remixicon/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import Markdown from "react-markdown";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_home/quests/$questId")({
  component: QuestDetailRoute,
});

const getTotalCosts = (costs?: { cost: number; description: string }[]) => {
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

const QuestCosts = ({
  costs,
}: { costs?: { cost: number; description: string }[] }) => {
  const totalCosts = getTotalCosts(costs);

  return (
    <div className="flex flex-col mb-4">
      <div className="flex flex-col">
        <div className="text-gray-dim">Cost</div>
        <div className="text-2xl flex gap-0.5 items-center">
          {totalCosts}
          {costs?.length && (
            <DialogTrigger>
              <TooltipTrigger>
                <Button variant="icon" size="small">
                  <RiQuestionLine />
                </Button>
                <Tooltip>See cost breakdown</Tooltip>
              </TooltipTrigger>
              <Popover className="p-4">
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
                    {totalCosts}
                  </dd>
                </dl>
              </Popover>
            </DialogTrigger>
          )}
        </div>
      </div>
    </div>
  );
};

function QuestDetailRoute() {
  const { questId } = Route.useParams();
  const navigate = useNavigate();
  // TODO: Opportunity to combine these queries?
  const quest = useQuery(api.quests.getQuest, {
    questId: questId as Id<"quests">,
  });
  const userQuest = useQuery(api.userQuests.getUserQuestByQuestId, {
    questId: questId as Id<"quests">,
  });

  const changeStatus = useMutation(api.userQuests.updateQuestStatus);
  const removeQuest = useMutation(api.userQuests.removeQuest);

  const handleStatusChange = (status: Status) => {
    changeStatus({ questId: questId as Id<"quests">, status: status });
  };

  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    removeQuest({ questId }).then(() => {
      toast(`Removed ${title} quest`);
      navigate({ to: "/" });
    });
  };

  // TODO: Improve loading state to prevent flash of empty
  if (quest === undefined || userQuest === undefined) return;
  if (quest === null || userQuest === null)
    return <Empty title="Quest not found" icon={RiSignpostLine} />;

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title={quest.title}
        badge={quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
        className="px-6 border-b border-gray-dim h-16"
      >
        <StatusSelect
          status={userQuest.status as Status}
          onChange={handleStatusChange}
          isCore={quest.category === "core"}
        />
        <MenuTrigger>
          <Button
            aria-label="Quest settings"
            variant="icon"
            icon={RiMoreFill}
            className="-mr-2"
          />
          <Menu placement="bottom end">
            <MenuItem
              onAction={() => handleRemoveQuest(quest._id, quest.title)}
            >
              Remove quest
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </PageHeader>
      <Container className="overflow-y-auto">
        <QuestCosts costs={quest.costs} />
        {quest.urls && (
          <div className="flex flex-col items-start gap-1 mb-4">
            {quest.urls.map((url) => (
              <Link
                key={url}
                href={url}
                className="inline-flex gap-1 items-center"
              >
                <RiLink size={20} />
                {url}
              </Link>
            ))}
          </div>
        )}
        {quest.content ? (
          <Markdown className="prose dark:prose-invert">
            {quest.content}
          </Markdown>
        ) : (
          "No content"
        )}
      </Container>
    </div>
  );
}
