import { AppContent } from "@/components/app";
import { Empty } from "@/components/common";
import {
  QuestCosts,
  QuestDetails,
  QuestDocuments,
  QuestFaqs,
  QuestPageHeader,
  QuestReferences,
  QuestSteps,
  QuestTimeRequired,
} from "@/components/quests";
import { QuestBasics } from "@/components/quests/QuestBasics/QuestBasics";
import { QuestPageFooter } from "@/components/quests/QuestPageFooter/QuestPageFooter";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { rootRouteId } from "@tanstack/react-router";
import { Milestone } from "lucide-react";

type QuestSearch = {
  edit?: true | undefined;
};

export const Route = createFileRoute("/_authenticated/_home/$questSlug/")({
  component: QuestDetailRoute,
  loader: async ({ params: { questSlug }, context: { convex } }) => {
    const questData = await convex.query(api.quests.getWithUserQuest, {
      slug: questSlug,
    });
    if (questData.quest === null) {
      throw notFound({ routeId: rootRouteId });
    }
    return { questData };
  },
  validateSearch: (search: Record<string, unknown>): QuestSearch => {
    return {
      edit: search.edit === true ? true : undefined,
    };
  },
});

function QuestDetailRoute() {
  const { edit: isEditing } = Route.useSearch();
  const { questData } = Route.useLoaderData();

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
      <QuestPageHeader quest={quest} userQuest={userQuest} badge={badge} />
      <div className="flex flex-col gap-6 pb-12">
        <QuestBasics quest={quest} editable={isEditing} />
        <QuestDetails>
          <QuestCosts quest={quest} editable={isEditing} />
          <QuestTimeRequired quest={quest} editable={isEditing} />
        </QuestDetails>
        <QuestSteps quest={quest} editable={isEditing} />
        <QuestFaqs quest={quest} editable={isEditing} />
        <QuestDocuments quest={quest} editable={isEditing} />
        <QuestReferences quest={quest} editable={isEditing} />
      </div>
      <QuestPageFooter quest={quest} />
    </AppContent>
  );
}
