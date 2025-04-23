import { Empty } from "@/components/common";
import {
  QuestCosts,
  QuestDetails,
  QuestFaqs,
  QuestPageHeader,
  QuestStatusFooter,
  QuestSteps,
  QuestTimeRequired,
} from "@/components/quests";
import { QuestBasics } from "@/components/quests/QuestBasics/QuestBasics";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
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
  const { edit: isEditing } = Route.useSearch();
  const { questSlug } = Route.useParams();

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
        link={{
          children: "Go home",
          href: { to: "/" },
          button: { variant: "secondary" },
        }}
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
        {/* TODO: Restyle and condense; place next to tag in page header a la google maps */}
        <QuestDetails>
          <QuestCosts quest={quest} editable={isEditing} />
          <QuestTimeRequired quest={quest} editable={isEditing} />
        </QuestDetails>
        <QuestSteps quest={quest} editable={isEditing} />
        <QuestFaqs quest={quest} editable={isEditing} />
        {!isEditing && (
          <QuestStatusFooter quest={quest} userQuest={userQuest} />
        )}
      </div>
    </>
  );
}
