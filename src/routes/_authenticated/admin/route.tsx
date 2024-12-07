import { AppContent, AppSidebar } from "@/components/app";
import { Container, Nav, NavGroup, NavItem } from "@/components/common";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { FileText, Milestone } from "lucide-react";

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
    <Container className="flex">
      <AppSidebar>
        <Nav>
          <NavGroup label="Content">
            <NavItem icon={Milestone} href={{ to: "/admin/quests" }}>
              Quests
            </NavItem>
            <NavItem icon={FileText} href={{ to: "/admin/documents" }}>
              Documents
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
