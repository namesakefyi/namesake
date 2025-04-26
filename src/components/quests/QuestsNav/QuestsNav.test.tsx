import { CATEGORIES } from "@/constants";
import { useMatchRoute } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestsNav } from "./QuestsNav";

interface MockQueriesConfig {
  user?: { birthplace: string } | undefined;
  totalQuests?: number | undefined;
  completedQuests?: number | undefined;
  questsByCategory?: Record<string, any[]> | undefined;
}

const mockQueries = ({
  user = { birthplace: "US" },
  totalQuests = 0,
  completedQuests = 0,
  questsByCategory = {},
}: MockQueriesConfig = {}) => {
  const queryMock = useQuery as ReturnType<typeof vi.fn>;

  queryMock
    .mockReturnValueOnce(user)
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

    render(<QuestsNav />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("5 complete")).toBeInTheDocument();
  });

  it("does not render progress bar when there are no quests", () => {
    mockQueries();
    render(<QuestsNav />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders core category items when no quests exist", () => {
    mockQueries();
    render(<QuestsNav />);

    // Check for core category labels
    expect(screen.getByText(CATEGORIES.courtOrder.label)).toBeInTheDocument();
    expect(
      screen.getByText(CATEGORIES.socialSecurity.label),
    ).toBeInTheDocument();
    expect(screen.getByText(CATEGORIES.stateId.label)).toBeInTheDocument();
    expect(screen.getByText(CATEGORIES.passport.label)).toBeInTheDocument();
    expect(
      screen.getByText(CATEGORIES.birthCertificate.label),
    ).toBeInTheDocument();
  });

  it("hides birth certificate option for users born outside US", () => {
    mockQueries({
      user: { birthplace: "other" },
    });

    render(<QuestsNav />);
    expect(
      screen.queryByText(CATEGORIES.birthCertificate.label),
    ).not.toBeInTheDocument();
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

    render(<QuestsNav />);

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

    render(<QuestsNav />);

    expect(screen.getByText("Other Quest")).toBeInTheDocument();
    expect(screen.getByLabelText("Not started")).toBeInTheDocument();
  });

  it("handles loading state when queries return undefined", () => {
    mockQueries({
      user: undefined,
      totalQuests: undefined,
      completedQuests: undefined,
      questsByCategory: undefined,
    });

    render(<QuestsNav />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
