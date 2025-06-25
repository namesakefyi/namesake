import { useMatchRoute } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestsSidebar } from "./QuestsSidebar";

interface MockQueriesConfig {
  progress?:
    | {
        totalQuests: number;
        completedQuests: number;
        hasGettingStarted: boolean;
        gettingStartedStatus: string;
      }
    | undefined;
  questsByCategory?:
    | Array<{
        label: string;
        category: string | null;
        items: Array<{
          type: "quest" | "placeholder";
          category: string;
          data: any;
          slug?: string;
        }>;
      }>
    | undefined;
}

const mockQueries = ({
  progress = {
    totalQuests: 0,
    completedQuests: 0,
    hasGettingStarted: false,
    gettingStartedStatus: "notStarted",
  },
  questsByCategory = [],
}: MockQueriesConfig = {}) => {
  const queryMock = useQuery as ReturnType<typeof vi.fn>;

  queryMock.mockReturnValueOnce(progress).mockReturnValueOnce(questsByCategory);
};

describe("QuestsSidebar", () => {
  const mockMatchRoute = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMatchRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMatchRoute,
    );
  });

  it("renders progress bar when there are quests", () => {
    mockQueries({
      progress: {
        totalQuests: 5,
        completedQuests: 2,
        hasGettingStarted: false,
        gettingStartedStatus: "notStarted",
      },
      questsByCategory: [
        {
          label: "Core",
          category: null,
          items: [
            {
              type: "quest",
              category: "courtOrder",
              data: {
                _id: "quest1",
                slug: "ma-court-order",
                title: "MA Court Order",
                status: "inProgress",
                jurisdiction: "Massachusetts",
                category: "courtOrder",
              },
              slug: "ma-court-order",
            },
          ],
        },
      ],
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
      progress: {
        totalQuests: 1,
        completedQuests: 0,
        hasGettingStarted: false,
        gettingStartedStatus: "notStarted",
      },
      questsByCategory: [
        {
          label: "Core",
          category: null,
          items: [
            {
              type: "quest",
              category: "courtOrder",
              data: {
                _id: "quest1",
                slug: "ma-court-order",
                title: "MA Court Order",
                status: "inProgress",
                jurisdiction: "Massachusetts",
                category: "courtOrder",
              },
              slug: "ma-court-order",
            },
          ],
        },
      ],
    });

    render(<QuestsSidebar />);

    expect(screen.getByText("MA Court Order")).toBeInTheDocument();
    expect(screen.getByText("Massachusetts")).toBeInTheDocument();
    expect(screen.getByLabelText("In progress")).toBeInTheDocument();
  });

  it("renders additional quest groups", () => {
    mockQueries({
      progress: {
        totalQuests: 1,
        completedQuests: 0,
        hasGettingStarted: false,
        gettingStartedStatus: "notStarted",
      },
      questsByCategory: [
        {
          label: "Other",
          category: "other",
          items: [
            {
              type: "quest",
              category: "other",
              data: {
                _id: "quest2",
                slug: "other-quest",
                title: "Other Quest",
                status: "notStarted",
                category: "other",
              },
              slug: "other-quest",
            },
          ],
        },
      ],
    });

    render(<QuestsSidebar />);

    expect(screen.getByText("Other Quest")).toBeInTheDocument();
    expect(screen.getByLabelText("Not started")).toBeInTheDocument();
  });

  it("handles loading state when queries return undefined", () => {
    mockQueries({
      progress: undefined,
      questsByCategory: undefined,
    });

    render(<QuestsSidebar />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
