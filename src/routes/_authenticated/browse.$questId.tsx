import { AppContent } from "@/components/app";
import { AddOrGoToQuestButton, PreviewOrAddedBadge } from "@/components/browse";
import {
  QuestContent,
  QuestCosts,
  QuestDetails,
  QuestDocuments,
  QuestPageHeader,
  QuestTimeRequired,
  QuestUrls,
  QuestUsageCount,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/browse/$questId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { questId } = Route.useParams();
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });

  if (!quest) return null;

  return (
    <AppContent>
      <QuestPageHeader
        quest={quest}
        badge={<PreviewOrAddedBadge quest={quest} />}
      >
        <AddOrGoToQuestButton quest={quest} />
      </QuestPageHeader>
      <div className="flex flex-col gap-6">
        <QuestDetails>
          <QuestCosts quest={quest} />
          <QuestTimeRequired quest={quest} />
          <QuestUsageCount quest={quest} />
        </QuestDetails>
        <QuestDocuments quest={quest} />
        <QuestUrls urls={quest.urls} />
        <QuestContent initialContent={quest.content} editable={false} />
      </div>
    </AppContent>
  );
}
