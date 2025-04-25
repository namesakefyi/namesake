import { Empty } from "@/components/common";
import {
  QuestCallToAction,
  QuestContent,
  QuestFaqs,
  QuestPageHeader,
} from "@/components/quests";
import { useIsMobile } from "@/utils/useIsMobile";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Milestone } from "lucide-react";
import { tv } from "tailwind-variants";

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
  const isMobile = useIsMobile();

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

  const containerStyles = tv({
    base: "flex flex-col",
    variants: {
      isMobile: {
        true: "min-h-screen-minus-mobile",
        false: "min-h-dvh",
      },
    },
  });

  return (
    <div className={containerStyles({ isMobile })}>
      <QuestPageHeader
        quest={quest}
        userQuest={userQuest}
        editable={isEditing}
      />
      <div className="flex flex-1 flex-col gap-6 app-padding">
        <QuestContent quest={quest} editable={isEditing} />
        <QuestFaqs quest={quest} editable={isEditing} />
      </div>
      {!isEditing && <QuestCallToAction quest={quest} userQuest={userQuest} />}
    </div>
  );
}
