import {
  AppContent,
  AppSidebar,
  Container,
  Nav,
  NavGroup,
  NavItem,
} from "@/components";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { FileText, Milestone, RectangleEllipsis } from "lucide-react";

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
            <NavItem icon={FileText} href={{ to: "/admin/forms" }}>
              Forms
            </NavItem>
            <NavItem icon={RectangleEllipsis} href={{ to: "/admin/fields" }}>
              Fields
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
