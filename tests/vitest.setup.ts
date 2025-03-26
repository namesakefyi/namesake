import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

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
