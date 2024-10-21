import { Container, Nav } from "@/components";
import { RiLock2Line, RiSettings3Line } from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <>
      <div className="flex flex-1 max-w-screen min-h-0">
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
        <Container className="overflow-y-auto">
          <Outlet />
        </Container>
      </div>
    </>
  );
}
