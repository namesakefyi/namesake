import "@testing-library/jest-dom/vitest";
import fs from "node:fs";
import path from "node:path";
import { Component, type ReactNode } from "react";
import { afterEach, beforeEach, vi } from "vitest";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  Authenticated: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(),
}));

vi.mock("@/utils/useTheme", () => ({
  useTheme: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
  useRouter: () => ({
    navigate: vi.fn(),
    history: {
      go: vi.fn(),
    },
  }),
  useSearch: vi.fn(),
  useMatchRoute: vi.fn(),
}));

// Mock posthog
vi.mock("posthog-js/react", () => ({
  usePostHog: vi.fn(() => ({
    captureException: vi.fn(),
  })),
  PostHogErrorBoundary: class ErrorBoundary extends Component<{
    children: ReactNode;
    fallback: (props: { error: Error }) => ReactNode;
  }> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    render() {
      if (this.state.hasError) {
        return this.props.fallback({ error: this.state.error! });
      }
      return this.props.children;
    }
  },
}));

// Mock encryption functions
vi.mock("@/utils/encryption", () => ({
  useEncryptionKey: vi.fn(),
  encryptData: vi.fn(),
  decryptData: vi.fn(),
}));

// Add type for mocked IntersectionObserver
declare global {
  interface Window {
    IntersectionObserver: ReturnType<typeof vi.fn>;
  }
}

// Update the mock assignment
window.IntersectionObserver = vi.fn() as any;
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch for PDF tests
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn((input: RequestInfo | URL) => {
    const url = input.toString();
    const relativePath = url.startsWith("/") ? url.slice(1) : url;
    const filePath = path.join(process.cwd(), relativePath);

    try {
      const buffer = fs.readFileSync(filePath);
      return Promise.resolve(
        new Response(buffer, {
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "content-type": "application/pdf",
          }),
        }),
      );
    } catch (error) {
      return Promise.resolve(
        new Response(null, {
          status: 404,
          statusText: `File not found: ${filePath}`,
          headers: new Headers({
            "content-type": "text/html",
          }),
        }),
      );
    }
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});
