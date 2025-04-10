import { Empty } from "@/components/common";
import {
  QuestContent,
  QuestCosts,
  QuestDetails,
  QuestFaqs,
  QuestPageHeader,
  QuestReferences,
  QuestTimeRequired,
} from "@/components/quests";
import { QuestBasics } from "@/components/quests/QuestBasics/QuestBasics";
import { QuestPageFooter } from "@/components/quests/QuestPageFooter/QuestPageFooter";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Milestone } from "lucide-react";

type QuestSearch = {
  edit?: true | undefined;
};

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questSlug/",
)({
  component: QuestDetailRoute,
  validateSearch: (search: Record<string, unknown>): QuestSearch => {
    return {
      edit: search.edit === true ? true : undefined,
    };
  },
});

function QuestDetailRoute() {
  const router = useRouter();
  const { questSlug } = Route.useParams();
  const { edit: isEditing } = Route.useSearch();

  const questData = useQuery(api.quests.getWithUserQuest, {
    slug: questSlug,
  });

  // TODO: Improve loading state to prevent flash of empty
  if (questData === undefined) return;
  if (questData.quest === null)
    return (
      <Empty
        title="Quest not found"
        icon={Milestone}
        button={{ children: "Go back", onPress: () => router.history.go(-1) }}
      />
    );

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
    <>
      <QuestPageHeader quest={quest} userQuest={userQuest} badge={badge} />
      <div className="flex flex-col gap-6 pb-12">
        <QuestBasics quest={quest} editable={isEditing} />
        <QuestDetails>
          <QuestCosts quest={quest} editable={isEditing} />
          <QuestTimeRequired quest={quest} editable={isEditing} />
        </QuestDetails>
        <QuestContent quest={quest} editable={isEditing} />
        <QuestFaqs quest={quest} editable={isEditing} />
        <QuestReferences quest={quest} editable={isEditing} />
      </div>
      <QuestPageFooter quest={quest} userQuest={userQuest} />
    </>
  );
}
