import {
  RiFileTextFill,
  RiFileTextLine,
  RiSignpostFill,
  RiSignpostLine,
} from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Container, Nav } from "../../components";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

// TODO: Protect this route for admins only

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
