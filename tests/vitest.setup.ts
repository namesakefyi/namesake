import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock the convex mutation hook
vi.mock("convex/react", () => ({
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
