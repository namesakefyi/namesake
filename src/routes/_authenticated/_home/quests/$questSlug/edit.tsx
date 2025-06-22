import { QuestPageHeader } from "@/components/quests";
import { QuestContent } from "@/components/quests";
import { api } from "@convex/_generated/api";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questSlug/edit",
)({
  beforeLoad: ({ context }) => {
    const isAdmin = context.role === "admin";

    if (!isAdmin) {
      throw redirect({
        to: "/",
        statusCode: 401,
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { questSlug } = Route.useParams();

  const quest = useQuery(api.quests.getBySlug, {
    slug: questSlug,
  });

  if (!quest) return null;

  return (
    <>
      <QuestPageHeader quest={quest} editable={true} />
      <div className="flex flex-1 flex-col gap-6 py-8">
        <QuestContent quest={quest} editable={true} />
      </div>
    </>
  );
}
