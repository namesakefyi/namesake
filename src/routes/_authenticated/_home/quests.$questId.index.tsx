import { AppContent, PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  Empty,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  RichText,
} from "@/components/common";
import {
  QuestCosts,
  QuestForm,
  QuestTimeRequired,
  QuestUrls,
  StatusSelect,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { Status } from "@convex/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Ellipsis, Milestone, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_home/quests/$questId/")({
  component: QuestDetailRoute,
});

function QuestDetailRoute() {
  const { questId } = Route.useParams();

  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrent);
  const canEdit = user?.role === "admin";

  // TODO: Opportunity to combine these queries?
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });
  const userQuest = useQuery(api.userQuests.getByQuestId, {
    questId: questId as Id<"quests">,
  });

  const changeStatus = useMutation(api.userQuests.setStatus);
  const deleteForever = useMutation(api.userQuests.deleteForever);

  const handleStatusChange = (status: Status) => {
    changeStatus({ questId: questId as Id<"quests">, status: status });
  };

  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    deleteForever({ questId }).then(() => {
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
        {canEdit && (
          <Link
            href={{ to: "/quests/$questId/edit", params: { questId } }}
            button={{
              variant: "ghost",
            }}
          >
            <Pencil size={16} />
            Edit
          </Link>
        )}
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
      <div className="flex gap-4 mb-4">
        <QuestCosts quest={quest} />
        <QuestTimeRequired quest={quest} />
      </div>
      <QuestUrls urls={quest.urls} />
      <RichText initialContent={quest.content} editable={false} />
      <QuestForm quest={quest} />
    </AppContent>
  );
}
