import {
  QuestCallToAction,
  QuestContent,
  QuestPageHeader,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

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

  if (!questData) return null;

  const quest = questData.quest;
  const userQuest = questData.userQuest;

  if (!quest) return null;

  return (
    <>
      <QuestPageHeader quest={quest} userQuest={userQuest} editable={false} />
      <div className="flex flex-1 flex-col gap-6 app-padding py-6">
        <QuestContent quest={quest} editable={false} />
        <QuestCallToAction quest={quest} userQuest={userQuest} />
      </div>
    </>
  );
}
