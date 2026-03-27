import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Cost } from "@/utils/formatTotalCosts";
import { CostsTable } from "./CostsTable";

const filingFee: Cost = {
  _type: "cost",
  _key: "filing",
  title: "Court filing fee",
  amount: 150,
};
const optionalFee: Cost = {
  _type: "cost",
  _key: "pub",
  title: "Publication fee",
  amount: 75,
  required: "notRequired",
};
const requiredFee: Cost = {
  _type: "cost",
  _key: "kit",
  title: "Name change kit",
  amount: 25,
  required: "required",
};

describe("CostsTable", () => {
  it("renders nothing when costs is empty", () => {
    const { container } = render(<CostsTable costs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a table when costs are provided", () => {
    render(<CostsTable costs={[filingFee]} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders accessible column headers", () => {
    render(<CostsTable costs={[filingFee]} />);
    expect(
      screen.getByRole("columnheader", { name: "Cost" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Amount" }),
    ).toBeInTheDocument();
  });

  it("renders a row for each cost", () => {
    render(<CostsTable costs={[filingFee, requiredFee]} />);

    expect(
      screen.getByRole("cell", { name: "Court filing fee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Name change kit" }),
    ).toBeInTheDocument();
  });

  it("renders the formatted amount for each cost", () => {
    render(<CostsTable costs={[filingFee]} />);
    // Scope to the cost row (not the footer total row)
    const costRow = screen
      .getByRole("cell", { name: "Court filing fee" })
      .closest("tr");
    expect(costRow).not.toBeNull();
    expect(
      within(costRow as HTMLElement).getByRole("cell", { name: "$150" }),
    ).toBeInTheDocument();
  });

  it("appends '(optional)' to the title when required is notRequired", () => {
    render(<CostsTable costs={[optionalFee]} />);
    expect(
      screen.getByRole("cell", { name: "Publication fee (optional)" }),
    ).toBeInTheDocument();
  });

  it("does not append '(optional)' when required is required", () => {
    render(<CostsTable costs={[requiredFee]} />);
    expect(
      screen.getByRole("cell", { name: "Name change kit" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: /optional/ }),
    ).not.toBeInTheDocument();
  });

  it("does not append '(optional)' when required is unset", () => {
    render(<CostsTable costs={[filingFee]} />);
    expect(
      screen.queryByRole("cell", { name: /optional/ }),
    ).not.toBeInTheDocument();
  });

  it("renders the total of required costs in the footer", () => {
    render(<CostsTable costs={[filingFee, requiredFee]} />);
    // Both are required — total is $175
    expect(screen.getByRole("cell", { name: "$175" })).toBeInTheDocument();
  });

  it("renders a cost range in the footer when optional costs exist", () => {
    render(<CostsTable costs={[filingFee, optionalFee]} />);
    // Required: $150, total with optional: $225 → range
    expect(screen.getByRole("cell", { name: "$150–$225" })).toBeInTheDocument();
  });

  it("renders the Total label in the footer", () => {
    render(<CostsTable costs={[filingFee]} />);
    expect(screen.getByRole("cell", { name: "Total" })).toBeInTheDocument();
  });
});
