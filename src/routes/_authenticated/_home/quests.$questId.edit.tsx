import { AppContent, PageHeader } from "@/components/app";
import { Badge, Empty, Link, RichText } from "@/components/common";
import {
  QuestCosts,
  QuestForms,
  QuestTimeRequired,
  QuestUrls,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Check, Milestone } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questId/edit",
)({
  beforeLoad: ({ context }) => {
    const isAdmin = context.role === "admin";

    // For now, only admins can edit quests
    if (!isAdmin) {
      throw redirect({
        to: "/",
        statusCode: 401,
        replace: true,
      });
    }
  },
  component: QuestEditRoute,
});

function QuestEditRoute() {
  const { questId } = Route.useParams();

  // TODO: Opportunity to combine these queries?
  const quest = useQuery(api.quests.getQuest, {
    questId: questId as Id<"quests">,
  });

  // TODO: Improve loading state to prevent flash of empty
  if (quest === undefined) return;
  if (quest === null) return <Empty title="Quest not found" icon={Milestone} />;

  return (
    <AppContent>
      <PageHeader
        title={quest.title}
        badge={quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
      >
        <Link
          href={{ to: "/quests/$questId", params: { questId: quest._id } }}
          button={{ variant: "ghost" }}
        >
          <Check size={16} />
          Save
        </Link>
      </PageHeader>
      <div className="flex gap-4 mb-4 lg:mb-6 xl:mb-8">
        <QuestCosts quest={quest} editable />
        <QuestTimeRequired quest={quest} editable />
      </div>
      <QuestUrls urls={quest.urls} />
      <QuestForms questId={quest._id} />
      <RichText initialContent={quest.content} />
    </AppContent>
  );
}
