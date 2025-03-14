import { PageHeader } from "@/components/app";
import { UserDataTable } from "@/components/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/data")({
  component: DataRoute,
});

function DataRoute() {
  return (
    <>
      <PageHeader title="Data" />
      <UserDataTable />
    </>
  );
}
