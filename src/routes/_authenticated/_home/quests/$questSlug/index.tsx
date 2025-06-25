import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import {
  QuestCallToAction,
  QuestContent,
  QuestPageHeader,
} from "@/components/quests";
import type { Status } from "@/constants";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questSlug/",
)({
  component: QuestDetailRoute,
});

function QuestDetailRoute() {
  const { questSlug } = Route.useParams();

  const questData = useQuery(api.quests.getWithUserQuest, {
    slug: questSlug,
  });

  const addQuest = useMutation(api.userQuests.create);
  const setStatus = useMutation(api.userQuests.setStatus);

  const handleAddQuest = async () => {
    if (!quest) return;
    try {
      await addQuest({ questId: quest._id });
      toast.success("Quest added to your list!");
    } catch (_err) {
      toast.error("Failed to add quest. Please try again.");
    }
  };

  const handleChangeStatus = async (status: Status) => {
    if (!quest) return;
    try {
      await setStatus({
        questId: quest._id,
        status,
      });
      toast.success("Status updated!");
    } catch (_err) {
      toast.error("Failed to change status. Please try again.");
    }
  };

  if (!questData) return null;

  const quest = questData.quest;
  const userQuest = questData.userQuest;

  if (!quest) return null;

  return (
    <>
      <QuestPageHeader quest={quest} userQuest={userQuest} editable={false} />
      <div className="flex flex-1 flex-col gap-6 py-6">
        <QuestContent quest={quest} editable={false} />
        <QuestCallToAction
          data={{ quest, userQuest }}
          onAddQuest={handleAddQuest}
          onChangeStatus={handleChangeStatus}
          isLoading={!questData}
        />
      </div>
    </>
  );
}
