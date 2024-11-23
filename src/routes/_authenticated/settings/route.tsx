import { AppSidebar, Container, Nav, NavItem } from "@/components";
import { RiLock2Line, RiSettings3Line } from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <Container className="flex gap-6">
      <AppSidebar>
        <Nav>
          <NavItem icon={RiSettings3Line} href={{ to: "/settings/overview" }}>
            Overview
          </NavItem>
          <NavItem icon={RiLock2Line} href={{ to: "/settings/data" }}>
            Data
          </NavItem>
        </Nav>
      </AppSidebar>
      <div className="w-full">
        <Outlet />
      </div>
    </Container>
  );
}
