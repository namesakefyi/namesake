import { AppContent } from "@/components/app";
import { Empty } from "@/components/common";
import {
  QuestCosts,
  QuestDetails,
  QuestDocuments,
  QuestPageHeader,
  QuestTimeRequired,
  QuestUrls,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Milestone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_home/$questSlug/edit/")({
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
  const { questSlug } = Route.useParams();

  const quest = useQuery(api.quests.getBySlug, {
    slug: questSlug,
  });

  // TODO: Improve loading state to prevent flash of empty
  if (quest === undefined) return;
  if (quest === null) return <Empty title="Quest not found" icon={Milestone} />;

  return (
    <AppContent>
      <QuestPageHeader quest={quest} />
      <div className="flex flex-col gap-6">
        <QuestDetails>
          <QuestCosts quest={quest} editable />
          <QuestTimeRequired quest={quest} editable />
        </QuestDetails>
        <QuestDocuments quest={quest} editable />
        <QuestUrls urls={quest.urls} />
      </div>
    </AppContent>
  );
}
