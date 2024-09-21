import { Container, Nav } from "@/components";
import {
  RiFileTextFill,
  RiFileTextLine,
  RiSignpostFill,
  RiSignpostLine,
} from "@remixicon/react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
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
            icon: {
              default: RiSignpostLine,
              active: RiSignpostFill,
            },
            href: { to: "/admin/quests" },
            label: "Quests",
          },
          {
            icon: {
              default: RiFileTextLine,
              active: RiFileTextFill,
            },
            href: { to: "/admin/forms" },
            label: "Forms",
          },
        ]}
      />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}
