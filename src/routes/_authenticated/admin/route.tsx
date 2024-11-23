import { AppSidebar, Container, Nav, NavItem } from "@/components";
import { RiFileTextLine, RiInputField, RiSignpostLine } from "@remixicon/react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

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
    <Container className="flex gap-6">
      <AppSidebar>
        <Nav>
          <NavItem icon={RiSignpostLine} href={{ to: "/admin/quests" }}>
            Quests
          </NavItem>
          <NavItem icon={RiFileTextLine} href={{ to: "/admin/forms" }}>
            Forms
          </NavItem>
          <NavItem icon={RiInputField} href={{ to: "/admin/fields" }}>
            Fields
          </NavItem>
        </Nav>
      </AppSidebar>
      <div className="w-full">
        <Outlet />
      </div>
    </Container>
  );
}
