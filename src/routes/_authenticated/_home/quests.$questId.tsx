import { AppContent, PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  DialogTrigger,
  Empty,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  RichText,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { DocumentCard, StatusSelect } from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { Cost, Status, TimeRequired } from "@convex/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import {
  CircleHelp,
  Ellipsis,
  Link as LinkIcon,
  Milestone,
} from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_home/quests/$questId")({
  component: QuestDetailRoute,
});

const StatGroup = ({
  label,
  value,
  children,
}: { label: string; value: string; children?: React.ReactNode }) => (
  <div className="flex flex-col flex-1 border border-gray-dim py-3 px-4 rounded-lg">
    <div className="text-gray-dim text-sm">{label}</div>
    <div className="text-xl flex gap-0.5 items-center">
      {value}
      {children}
    </div>
  </div>
);

const QuestCosts = ({ costs }: { costs?: Cost[] }) => {
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
        <DialogTrigger>
          <TooltipTrigger>
            <Button variant="icon" size="small">
              <CircleHelp />
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
                {getTotalCosts(costs)}
              </dd>
            </dl>
          </Popover>
        </DialogTrigger>
      )}
    </StatGroup>
  );
};

const QuestTimeRequired = ({
  timeRequired,
}: {
  timeRequired: TimeRequired;
}) => {
  const getFormattedTime = (timeRequired: TimeRequired) => {
    return timeRequired
      ? `${timeRequired.min}–${timeRequired.max} ${timeRequired.unit}`
      : "Unknown";
  };

  const formattedTime = getFormattedTime(timeRequired);
  return (
    <StatGroup label="Time" value={formattedTime}>
      {timeRequired.description && (
        <DialogTrigger>
          <TooltipTrigger>
            <Button variant="icon" size="small">
              <CircleHelp />
            </Button>
            <Tooltip>See details</Tooltip>
          </TooltipTrigger>
          <Popover className="p-4">
            <p className="text-sm max-w-xs">{timeRequired.description}</p>
          </Popover>
        </DialogTrigger>
      )}
    </StatGroup>
  );
};

const QuestUrls = ({ urls }: { urls?: string[] }) => {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-1 mb-4">
      {urls.map((url) => (
        <Link key={url} href={url} className="inline-flex gap-1 items-center">
          <LinkIcon size={20} />
          {url}
        </Link>
      ))}
    </div>
  );
};

const QuestForms = ({ questId }: { questId: Id<"quests"> }) => {
  const forms = useQuery(api.forms.getFormsForQuest, {
    questId,
  });

  if (!forms || forms.length === 0) return null;

  return (
    <div className="p-4 rounded-lg border border-gray-dim mb-8">
      <header className="flex gap-1 items-center pb-4">
        <h3 className="text-gray-dim text-sm">Forms</h3>
        <Badge size="xs" className="rounded-full">
          {forms.length}
        </Badge>
      </header>
      <div className="flex gap-4 overflow-x-auto p-4 -m-4">
        {forms.map((form) => (
          <DocumentCard
            key={form._id}
            title={form.title}
            formCode={form.formCode}
            downloadUrl={form.url ?? undefined}
          />
        ))}
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
    return <Empty title="Quest not found" icon={Milestone} />;

  return (
    <AppContent>
      <PageHeader
        title={quest.title}
        badge={quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
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
            icon={Ellipsis}
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
      <div className="flex gap-4 mb-4 lg:mb-6 xl:mb-8">
        <QuestCosts costs={quest.costs} />
        <QuestTimeRequired timeRequired={quest.timeRequired as TimeRequired} />
      </div>
      <QuestUrls urls={quest.urls} />
      <QuestForms questId={quest._id} />
      {quest.content ? (
        <RichText initialContent={quest.content} editable={false} />
      ) : (
        "No content"
      )}
    </AppContent>
  );
}
