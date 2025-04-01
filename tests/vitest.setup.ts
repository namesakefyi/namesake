import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

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
