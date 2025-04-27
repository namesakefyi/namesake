import { useMatchRoute } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppNav } from "./AppNav";

describe("AppNav", () => {
  const mockMatchRoute = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useMatchRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMatchRoute,
    );
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "user",
    });
  });

  it("renders home and settings links for regular users", () => {
    render(<AppNav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("includes admin link for admin users", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "admin",
    });

    render(<AppNav />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  describe("handles active state", () => {
    it("marks home as active for root path", () => {
      mockMatchRoute.mockImplementation((options) => {
        return options.to === "/" && options.fuzzy;
      });

      render(<AppNav />);

      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveClass("text-gray-normal");
    });

    it("marks home as active for quest paths", () => {
      mockMatchRoute.mockImplementation((options) => {
        return options.to === "/quests/$questSlug" && options.fuzzy;
      });

      render(<AppNav />);

      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveClass("text-gray-normal");
    });

    it("marks settings as active for settings path", () => {
      mockMatchRoute.mockImplementation((options) => {
        return options.to === "/settings" && options.fuzzy;
      });

      render(<AppNav />);

      const settingsLink = screen.getByText("Settings").closest("a");
      expect(settingsLink).toHaveClass("text-gray-normal");
    });

    it("marks admin as active for admin path", () => {
      (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        role: "admin",
      });

      mockMatchRoute.mockImplementation((options) => {
        return options.to === "/admin" && options.fuzzy;
      });

      render(<AppNav />);

      const adminLink = screen.getByText("Admin").closest("a");
      expect(adminLink).toHaveClass("text-gray-normal");
    });
  });

  it("renders icons for all navigation items", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "admin",
    });

    render(<AppNav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
