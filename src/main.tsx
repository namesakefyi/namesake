import "./styles/index.css";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { routeTree } from "./routeTree.gen";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const router = createRouter({
  routeTree,
  context: {
    title: undefined!,
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const title = "Namesake";
  const auth = useConvexAuth();
  return <RouterProvider router={router} context={{ title, auth }} />;
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
