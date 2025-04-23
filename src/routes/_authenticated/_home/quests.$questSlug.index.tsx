import { Empty } from "@/components/common";
import {
  QuestFaqs,
  QuestPageHeader,
  QuestStatusFooter,
  QuestSteps,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
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

  return (
    <>
      <QuestPageHeader
        quest={quest}
        userQuest={userQuest}
        editable={isEditing}
      />
      <div className="flex flex-col gap-6 pb-12">
        <QuestSteps quest={quest} editable={isEditing} />
        <QuestFaqs quest={quest} editable={isEditing} />
        {!isEditing && (
          <QuestStatusFooter quest={quest} userQuest={userQuest} />
        )}
      </div>
    </>
  );
}
