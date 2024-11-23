import "./styles/index.css";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  type ConvexAuthState,
  ConvexReactClient,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { TriangleAlert } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
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
  defaultPreload: "intent",
  defaultNotFoundComponent: () => (
    <Empty
      title="Page not found"
      subtitle="We couldn't find that page."
      icon={TriangleAlert}
    />
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

let resolveAuth: (client: ConvexAuthState) => void;
const authClient: Promise<ConvexAuthState> = new Promise((resolve) => {
  resolveAuth = resolve;
});

const InnerApp = () => {
  const title = "Namesake";
  const auth = useConvexAuth();
  const role = useQuery(api.users.getCurrentUserRole) ?? undefined;

  useEffect(() => {
    if (auth.isLoading) return;

    resolveAuth(auth);
  }, [auth, auth.isLoading]);

  return (
    <RouterProvider
      router={router}
      context={{ title, auth: authClient, role }}
    />
  );
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
