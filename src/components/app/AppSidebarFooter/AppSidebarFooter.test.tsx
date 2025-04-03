import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppSidebarFooter } from "./AppSidebarFooter";

describe("AppSidebarFooter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "user",
    });
  });

  it("renders settings link for regular users", () => {
    render(<AppSidebarFooter />);

    const settingsLink = screen.getByRole("link", { name: "Settings" });
    expect(settingsLink).toBeInTheDocument();

    // Admin link should not be present
    expect(
      screen.queryByRole("link", { name: "Admin" }),
    ).not.toBeInTheDocument();
  });

  it("includes admin link for admin users", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "admin",
    });

    render(<AppSidebarFooter />);

    expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();

    const adminLink = screen.getByRole("link", { name: "Admin" });
    expect(adminLink).toBeInTheDocument();
  });
});
