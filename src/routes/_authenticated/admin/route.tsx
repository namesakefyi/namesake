import { Container, Nav } from "@/components";
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
    <div className="flex flex-1 max-w-screen">
      <Nav
        routes={[
          {
            icon: RiSignpostLine,
            href: { to: "/admin/quests" },
            label: "Quests",
          },
          {
            icon: RiFileTextLine,
            href: { to: "/admin/forms" },
            label: "Forms",
          },
          {
            icon: RiInputField,
            href: { to: "/admin/fields" },
            label: "Fields",
          },
        ]}
      />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}
