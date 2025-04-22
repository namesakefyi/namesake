import { useAuthActions } from "@convex-dev/auth/react";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsNav } from "./SettingsNav";

const mockMatchRoute = vi.fn();

describe("SettingsNav", () => {
  const mockSignOut = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthActions as ReturnType<typeof vi.fn>).mockReturnValue({
      signOut: mockSignOut,
    });
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useMatchRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMatchRoute,
    );
  });

  it("renders all navigation items", () => {
    render(<SettingsNav />);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Form Responses")).toBeInTheDocument();

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText(/Changelog/)).toBeInTheDocument();
    expect(screen.getByText("Report an Issue")).toBeInTheDocument();
    expect(screen.getByText("System Status")).toBeInTheDocument();
    expect(screen.getByText("Discord Community")).toBeInTheDocument();

    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();

    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("handles sign out correctly", async () => {
    render(<SettingsNav />);

    const signOutButton = screen.getByText("Sign out");
    await userEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/signin" });
  });

  it("renders external links with correct attributes", () => {
    render(<SettingsNav />);

    // Test specific external links we know should have these attributes
    const externalLinkTexts = [
      "About",
      "Report an Issue",
      "System Status",
      "Discord Community",
      "Terms of Service",
      "Privacy Policy",
    ];

    for (const linkText of externalLinkTexts) {
      const link = screen.getByText(linkText);
      expect(link.closest("a")).toHaveAttribute("target", "_blank");
      expect(link.closest("a")).toHaveAttribute("rel", "noreferrer");
    }
  });
});
