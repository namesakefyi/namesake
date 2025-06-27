import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestCostsTable } from "./QuestCostsTable";

describe("QuestCostsTable", () => {
  const mockCosts = [
    { cost: 100, description: "Application fee", isRequired: true },
    { cost: 50, description: "Certified copies", isRequired: true },
    { cost: 75, description: "Expedited processing", isRequired: false },
    { cost: 25, description: "Optional notary", isRequired: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when costs are undefined", () => {
    const { container } = render(<QuestCostsTable costs={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders table with costs correctly", () => {
    render(<QuestCostsTable costs={mockCosts} />);

    // Check table headers
    expect(
      screen.getByRole("columnheader", { name: "Cost" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Amount" }),
    ).toBeInTheDocument();

    // Check cost rows
    expect(screen.getByText("Application fee")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("Certified copies")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("Expedited processing")).toBeInTheDocument();
    expect(screen.getByText("$75")).toBeInTheDocument();
    expect(screen.getByText("Optional notary")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();

    // Check optional labels
    expect(screen.getAllByText("optional")).toHaveLength(2);

    // Check total
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$150–$250")).toBeInTheDocument();
  });

  it("renders table in card when card prop is true", () => {
    render(<QuestCostsTable costs={mockCosts} card={true} />);

    // Check if table is wrapped in a card
    const card = screen.getByRole("table").parentElement;
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      "p-4",
      "rounded-lg",
      "min-w-48",
      "w-max",
      "m-auto",
    );
  });

  it("formats currency values correctly", () => {
    const costsWithLargeNumbers = [
      { cost: 1000, description: "Large fee", isRequired: true },
      { cost: 2000, description: "Maximum fee", isRequired: true },
    ];

    render(<QuestCostsTable costs={costsWithLargeNumbers} />);

    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("$2,000")).toBeInTheDocument();
    expect(screen.getByText("$3,000")).toBeInTheDocument();
  });
});
