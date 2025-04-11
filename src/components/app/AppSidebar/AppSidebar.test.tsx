import { useTheme } from "@/utils/useTheme";
import { useAuthActions } from "@convex-dev/auth/react";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppSidebar } from "./AppSidebar";

describe("AppSidebar", () => {
  const mockSignOut = vi.fn();
  const mockSetTheme = vi.fn();
  const mockThemeSelection = new Set(["light"]);

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthActions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      signOut: mockSignOut,
    });
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      themeSelection: mockThemeSelection,
      setTheme: mockSetTheme,
    });
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "user",
    });
  });

  it("renders children content", () => {
    render(
      <AppSidebar>
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders header when provided", () => {
    render(
      <AppSidebar header={<div>Header Content</div>}>
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <AppSidebar footer={<div>Footer Content</div>}>
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders all sections when provided", () => {
    render(
      <AppSidebar
        header={<div>Header Content</div>}
        footer={<div>Footer Content</div>}
      >
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });
});
