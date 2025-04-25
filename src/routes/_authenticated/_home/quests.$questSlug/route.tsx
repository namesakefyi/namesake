import { Empty } from "@/components/common";
import { useIsMobile } from "@/utils/useIsMobile";
import { api } from "@convex/_generated/api";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Milestone } from "lucide-react";
import { tv } from "tailwind-variants";

export const Route = createFileRoute("/_authenticated/_home/quests/$questSlug")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
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
      <Outlet />
    </div>
  );
}
