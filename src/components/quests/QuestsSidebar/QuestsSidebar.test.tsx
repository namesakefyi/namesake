import { useMatchRoute } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestsSidebar } from "./QuestsSidebar";

interface MockQueriesConfig {
  totalQuests?: number | undefined;
  completedQuests?: number | undefined;
  questsByCategory?: Record<string, any[]> | undefined;
}

const mockQueries = ({
  totalQuests = 0,
  completedQuests = 0,
  questsByCategory = {},
}: MockQueriesConfig = {}) => {
  const queryMock = useQuery as ReturnType<typeof vi.fn>;

  queryMock
    .mockReturnValueOnce(totalQuests)
    .mockReturnValueOnce(completedQuests)
    .mockReturnValueOnce(questsByCategory);
};

describe("QuestsNav", () => {
  const mockMatchRoute = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMatchRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMatchRoute,
    );
  });

  it("renders progress bar when there are quests", () => {
    mockQueries({
      totalQuests: 5,
      completedQuests: 2,
    });

    render(<QuestsSidebar />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("5 complete")).toBeInTheDocument();
  });

  it("does not render progress bar when there are no quests", () => {
    mockQueries();
    render(<QuestsSidebar />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders quest items with status badges and jurisdiction", () => {
    mockQueries({
      totalQuests: 1,
      questsByCategory: {
        courtOrder: [
          {
            _id: "quest1",
            slug: "ma-court-order",
            title: "MA Court Order",
            status: "inProgress",
            jurisdiction: "Massachusetts",
            category: "courtOrder",
          },
        ],
      },
    });

    render(<QuestsSidebar />);

    expect(screen.getByText("MA Court Order")).toBeInTheDocument();
    expect(screen.getByText("Massachusetts")).toBeInTheDocument();
    expect(screen.getByLabelText("In progress")).toBeInTheDocument();
  });

  it("renders additional quest groups", () => {
    mockQueries({
      totalQuests: 1,
      questsByCategory: {
        other: [
          {
            _id: "quest2",
            slug: "other-quest",
            title: "Other Quest",
            status: "notStarted",
            category: "other",
          },
        ],
      },
    });

    render(<QuestsSidebar />);

    expect(screen.getByText("Other Quest")).toBeInTheDocument();
    expect(screen.getByLabelText("Not started")).toBeInTheDocument();
  });

  it("handles loading state when queries return undefined", () => {
    mockQueries({
      totalQuests: undefined,
      completedQuests: undefined,
      questsByCategory: undefined,
    });

    render(<QuestsSidebar />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
