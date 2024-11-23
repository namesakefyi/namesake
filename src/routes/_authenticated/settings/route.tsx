import {
  AppContent,
  AppSidebar,
  Container,
  Nav,
  NavGroup,
  NavItem,
} from "@/components";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CircleUser, Database } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <Container className="flex">
      <AppSidebar>
        <Nav>
          <NavGroup label="Settings">
            <NavItem icon={CircleUser} href={{ to: "/settings/account" }}>
              Account
            </NavItem>
            <NavItem icon={Database} href={{ to: "/settings/data" }}>
              Data
            </NavItem>
          </NavGroup>
        </Nav>
      </AppSidebar>
      <AppContent>
        <Outlet />
      </AppContent>
    </Container>
  );
}
