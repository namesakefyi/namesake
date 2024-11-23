import { Banner, PageHeader } from "@/components";
import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings/data")({
  component: DataRoute,
});

function DataRoute() {
  return (
    <>
      <PageHeader title="Data" />
      <Banner variant="success" icon={Lock}>
        Data shown here is end-to-end encrypted. Only you can access it.
      </Banner>
    </>
  );
}
