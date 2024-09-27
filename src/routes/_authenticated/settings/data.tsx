import { Banner, PageHeader } from "@/components";
import { RiLock2Line } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/data")({
  component: DataRoute,
});

function DataRoute() {
  return (
    <div>
      <PageHeader
        title="Data"
        subtitle="Manage, modify, or delete your data."
      />
      <Banner variant="success" icon={RiLock2Line}>
        Data shown here is end-to-end encrypted. Only you can access it.
      </Banner>
    </div>
  );
}
