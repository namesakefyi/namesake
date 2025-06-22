import { PageHeader } from "@/components/app";
import { GettingStarted } from "@/components/quests";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/getting-started",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader title="Getting Started" mobileBackLink={{ to: "/" }} />
      <div className="prose">Welcome to Namesake.</div>
      <GettingStarted />
    </>
  );
}
