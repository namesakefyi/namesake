import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsNav } from "./SettingsNav";

const mockMatchRoute = vi.fn();

describe("SettingsNav", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
