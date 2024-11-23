import { AppSidebar, Container, Nav, NavItem } from "@/components";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CircleUser, Database } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <Container className="flex gap-6">
      <AppSidebar>
        <Nav>
          <NavItem icon={CircleUser} href={{ to: "/settings/overview" }}>
            Overview
          </NavItem>
          <NavItem icon={Database} href={{ to: "/settings/data" }}>
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
