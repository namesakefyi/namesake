import { useTheme } from "@/utils/useTheme";
import { useAuthActions } from "@convex-dev/auth/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("renders logo and early access badge", () => {
    render(
      <AppSidebar>
        <div>Content</div>
      </AppSidebar>,
    );

    expect(screen.getByRole("img", { name: "Namesake" })).toBeInTheDocument();
    expect(screen.getByText("Early Access")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <AppSidebar>
        <div>Test Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("shows admin option in menu for admin users", async () => {
    const user = userEvent.setup();
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "admin",
    });

    render(
      <AppSidebar>
        <div>Content</div>
      </AppSidebar>,
    );

    await user.click(screen.getByRole("button", { name: "User settings" }));
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not show admin option for regular users", async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <div>Content</div>
      </AppSidebar>,
    );

    await user.click(screen.getByRole("button", { name: "User settings" }));
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("handles theme changes", async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <div>Content</div>
      </AppSidebar>,
    );

    await user.click(screen.getByRole("button", { name: "User settings" }));
    await user.click(screen.getByText("Theme"));
    await user.click(screen.getByText("Dark"));

    const [[firstArg]] = mockSetTheme.mock.calls;
    expect(firstArg).toBeInstanceOf(Set);
    expect([...firstArg]).toEqual(["dark"]);
  });

  it("shows current theme in menu", async () => {
    const user = userEvent.setup();
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "dark",
      themeSelection: new Set(["dark"]),
      setTheme: mockSetTheme,
    });

    render(
      <AppSidebar>
        <div>Content</div>
      </AppSidebar>,
    );

    await user.click(screen.getByRole("button", { name: "User settings" }));
    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("handles sign out", async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <div>Content</div>
      </AppSidebar>,
    );

    await user.click(screen.getByRole("button", { name: "User settings" }));
    await user.click(screen.getByText("Sign out"));

    expect(mockSignOut).toHaveBeenCalled();
  });
});
