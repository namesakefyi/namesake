import { AppContent, PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  Empty,
  Menu,
  MenuItem,
  MenuTrigger,
  RichText,
} from "@/components/common";
import {
  QuestCosts,
  QuestForms,
  QuestTimeRequired,
  QuestUrls,
  StatusSelect,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { Status, TimeRequired } from "@convex/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Ellipsis, Milestone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_home/quests/$questId")({
  component: QuestDetailRoute,
});

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
