import { useMatchRoute } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminNav } from "./AdminNav";

describe("AdminNav", () => {
  const mockMatchRoute = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useMatchRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMatchRoute,
    );
  });

  it("renders the navigation container and items", () => {
    render(<AdminNav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    const navItems = screen.getAllByRole("link");
    expect(navItems).toHaveLength(2);

    expect(screen.getByText("Quests")).toBeInTheDocument();
    expect(screen.getByText("Early Access")).toBeInTheDocument();
  });
});
