import { Empty } from "@/components";
import { RiSignpostLine } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/quests/")({
  component: IndexRoute,
});

function IndexRoute() {
  return <Empty title="No quest selected" icon={RiSignpostLine} />;
}
