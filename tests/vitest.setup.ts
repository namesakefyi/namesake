import "@testing-library/jest-dom/vitest";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, vi } from "vitest";

// Mock the convex mutation hook
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

// Mock toast notifications
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the auth hook
vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(),
}));

// Mock the useTheme hook
vi.mock("@/utils/useTheme", () => ({
  useTheme: vi.fn(),
}));

// Mock the useRouter hook
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: vi.fn(),
    history: {
      go: vi.fn(),
    },
  }),
}));

// Mock posthog
vi.mock("posthog-js", () => ({
  default: {
    captureException: vi.fn(),
  },
}));

// Add type for mocked IntersectionObserver
declare global {
  interface Window {
    IntersectionObserver: ReturnType<typeof vi.fn>;
  }
}

// Update the mock assignment
window.IntersectionObserver = vi.fn() as any;

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
