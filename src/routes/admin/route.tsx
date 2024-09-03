import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Container, Nav } from "../../components/shared";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

// TODO: Protect this route for admins only

function AdminRoute() {
  return (
    <div className="flex flex-1 max-w-screen">
      <Nav
        routes={[
          { href: { to: "/admin/quests" }, label: "Quests" },
          { href: { to: "/admin/forms" }, label: "Forms" },
        ]}
      />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}
