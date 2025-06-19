import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
} from "./AppSidebar";

describe("AppSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe("AppSidebarHeader", () => {
    it("renders header content", () => {
      render(
        <AppSidebar>
          <AppSidebarHeader>
            <div>Header Content</div>
          </AppSidebarHeader>
          <div>Main Content</div>
        </AppSidebar>,
      );

      expect(screen.getByText("Header Content")).toBeInTheDocument();
      expect(screen.getByText("Main Content")).toBeInTheDocument();
    });
  });

  describe("AppSidebarContent", () => {
    it("renders content", () => {
      render(
        <AppSidebar>
          <AppSidebarContent>
            <div>Main Content</div>
          </AppSidebarContent>
        </AppSidebar>,
      );

      expect(screen.getByText("Main Content")).toBeInTheDocument();
    });

    it("renders error fallback when child component throws", () => {
      vi.spyOn(console, "error").mockImplementation(() => null);

      const ErrorComponent = () => {
        throw new Error("Test error");
      };

      render(
        <AppSidebar>
          <AppSidebarContent>
            <ErrorComponent />
          </AppSidebarContent>
        </AppSidebar>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText(
          "We’ve been notified of the issue. Refresh the page to try again.",
        ),
      ).toBeInTheDocument();
    });

    it("maintains error boundary around content", () => {
      render(
        <AppSidebar>
          <AppSidebarContent>
            <div>Safe Content</div>
          </AppSidebarContent>
        </AppSidebar>,
      );

      expect(screen.getByText("Safe Content")).toBeInTheDocument();
      const error = screen.queryByText("Something went wrong");
      expect(error).not.toBeInTheDocument();
    });
  });

  describe("AppSidebarFooter", () => {
    it("renders footer content", () => {
      render(
        <AppSidebar>
          <div>Main Content</div>
          <AppSidebarFooter>
            <div>Footer Content</div>
          </AppSidebarFooter>
        </AppSidebar>,
      );

      expect(screen.getByText("Main Content")).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });
  });

  it("renders all sections when provided", () => {
    render(
      <AppSidebar>
        <AppSidebarHeader>
          <div>Header Content</div>
        </AppSidebarHeader>
        <AppSidebarContent>
          <div>Main Content</div>
        </AppSidebarContent>
        <AppSidebarFooter>
          <div>Footer Content</div>
        </AppSidebarFooter>
      </AppSidebar>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });
});
