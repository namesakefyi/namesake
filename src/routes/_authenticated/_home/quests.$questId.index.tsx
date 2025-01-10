import { AppContent } from "@/components/app";
import {
  Button,
  Empty,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/common";
import {
  QuestContent,
  QuestCosts,
  QuestDetails,
  QuestDocuments,
  QuestFormButton,
  QuestPageHeader,
  QuestTimeRequired,
  QuestUrls,
  StatusSelect,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { Status } from "@convex/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Ellipsis, Milestone } from "lucide-react";
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
      <QuestPageHeader quest={quest}>
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
            {canEdit && (
              <>
                <MenuItem
                  href={{
                    to: "/quests/$questId/edit",
                    params: { questId },
                  }}
                >
                  Edit quest
                </MenuItem>
                <MenuSeparator />
              </>
            )}
            <MenuItem
              onAction={() => handleRemoveQuest(quest._id, quest.title)}
            >
              Remove quest
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </QuestPageHeader>
      <div className="flex flex-col gap-6">
        <QuestDetails>
          <QuestCosts quest={quest} />
          <QuestTimeRequired quest={quest} />
        </QuestDetails>
        <QuestDocuments quest={quest} />
        <QuestUrls urls={quest.urls} />
        <QuestContent initialContent={quest.content} editable={false} />
        <QuestFormButton quest={quest} />
      </div>
    </AppContent>
  );
}
