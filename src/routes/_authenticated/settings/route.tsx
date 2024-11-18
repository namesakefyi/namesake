import { AppSidebar, Container, Nav } from "@/components";
import { RiLock2Line, RiSettings3Line } from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <Container className="flex gap-6">
      <AppSidebar>
        <Nav
          routes={[
            {
              icon: RiSettings3Line,
              href: { to: "/settings/overview" },
              label: "Overview",
            },
            {
              icon: RiLock2Line,
              href: { to: "/settings/data" },
              label: "Data",
            },
          ]}
        />
      </AppSidebar>
      <div className="w-full">
        <Outlet />
      </div>
    </Container>
  );
}
