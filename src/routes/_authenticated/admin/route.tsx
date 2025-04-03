import { AppContent, AppSidebar, AppSidebarHeader } from "@/components/app";
import { Nav, NavGroup, NavItem } from "@/components/common";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { FlaskConical, Milestone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    const isAdmin = context.role === "admin";

    if (!isAdmin) {
      throw redirect({
        to: "/",
        statusCode: 401,
        replace: true,
      });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <div className="flex">
      <AppSidebar header={<AppSidebarHeader />}>
        <Nav>
          <NavGroup label="Content">
            <NavItem icon={Milestone} href={{ to: "/admin/quests" }}>
              Quests
            </NavItem>
            <NavItem icon={FlaskConical} href={{ to: "/admin/early-access" }}>
              Early Access
            </NavItem>
          </NavGroup>
        </Nav>
      </AppSidebar>
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
