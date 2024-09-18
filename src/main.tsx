import "./styles/index.css";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { RiErrorWarningLine } from "@remixicon/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ConvexReactClient, useConvexAuth, useQuery } from "convex/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { api } from "../convex/_generated/api";
import { Empty } from "./components";
import { routeTree } from "./routeTree.gen";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const router = createRouter({
  routeTree,
  context: {
    title: undefined!,
    auth: undefined!,
    role: undefined!,
  },
  defaultNotFoundComponent: () => (
    <Empty
      title="Page not found"
      subtitle="We couldn't find that page."
      icon={RiErrorWarningLine}
    />
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const title = "Namesake";
  const auth = useConvexAuth();
  const role = useQuery(api.users.getCurrentUserRole);

  return <RouterProvider router={router} context={{ title, auth, role }} />;
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <HelmetProvider>
        <ConvexAuthProvider client={convex}>
          <ThemeProvider attribute="class">
            <InnerApp />
          </ThemeProvider>
        </ConvexAuthProvider>
      </HelmetProvider>
    </StrictMode>,
  );
}
