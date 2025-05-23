import { Empty } from "@/components/common";
import { api } from "@convex/_generated/api";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Milestone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_home/quests/$questSlug")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
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

  return (
    <div className="flex flex-col">
      <Outlet />
    </div>
  );
}
