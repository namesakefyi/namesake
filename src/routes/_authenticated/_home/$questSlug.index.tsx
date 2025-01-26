import { AppContent } from "@/components/app";
import {
  Button,
  Empty,
  Menu,
  MenuItem,
  MenuTrigger,
} from "@/components/common";
import {
  QuestCosts,
  QuestDetails,
  QuestDocuments,
  QuestPageHeader,
  QuestSteps,
  QuestTimeRequired,
  QuestUrls,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Ellipsis, Milestone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_home/$questSlug/")({
  component: QuestDetailRoute,
});

function QuestDetailRoute() {
  const { questSlug } = Route.useParams();

  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrent);
  const canEdit = user?.role === "admin";

  const questData = useQuery(api.quests.getWithUserQuest, {
    slug: questSlug,
  });

  const deleteForever = useMutation(api.userQuests.deleteForever);

  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    deleteForever({ questId }).then(() => {
      toast(`Removed ${title} quest`);
      navigate({ to: "/" });
    });
  };

  // TODO: Improve loading state to prevent flash of empty
  if (questData === undefined) return;
  if (questData.quest === null)
    return <Empty title="Quest not found" icon={Milestone} />;

  const quest = questData.quest;
  const userQuest = questData.userQuest;

  let badge = undefined;
  if (quest.jurisdiction) {
    badge = JURISDICTIONS[quest.jurisdiction as keyof typeof JURISDICTIONS];
  }
  if (quest.category === "passport" || quest.category === "socialSecurity") {
    badge = "United States";
  }

  return (
    <AppContent>
      <QuestPageHeader quest={quest} userQuest={userQuest} badge={badge}>
        <MenuTrigger>
          <Button
            aria-label="Quest settings"
            variant="icon"
            icon={Ellipsis}
            className="-mr-2"
            size="small"
          />
          <Menu placement="bottom end">
            {canEdit && (
              <MenuItem
                href={{
                  to: "/admin/quests/$questId",
                  params: { questId: quest._id },
                }}
              >
                Edit quest
              </MenuItem>
            )}
            {userQuest && (
              <MenuItem
                onAction={() => handleRemoveQuest(quest._id, quest.title)}
              >
                Remove quest
              </MenuItem>
            )}
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
        <QuestSteps quest={quest} />
      </div>
    </AppContent>
  );
}
