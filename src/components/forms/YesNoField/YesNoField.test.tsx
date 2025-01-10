import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { YesNoField } from "./YesNoField";

describe("YesNoField", () => {
  const defaultProps = {
    name: "test-field",
    label: "Test Question",
  };

  it("renders with default labels", () => {
    render(<YesNoField {...defaultProps} />);

    const label = screen.getByText("Test Question");
    const yesOption = screen.getByText("Yes");
    const noOption = screen.getByText("No");

    expect(label).toBeInTheDocument();
    expect(yesOption).toBeInTheDocument();
    expect(noOption).toBeInTheDocument();
  });

  it("supports custom labels", () => {
    render(
      <YesNoField
        {...defaultProps}
        yesLabel="Affirmative"
        noLabel="Negative"
      />,
    );

    const yesOption = screen.getByText("Affirmative");
    const noOption = screen.getByText("Negative");

    expect(yesOption).toBeInTheDocument();
    expect(noOption).toBeInTheDocument();
  });

  it("supports hidden label", () => {
    render(<YesNoField {...defaultProps} labelHidden />);

    const visibleLabel = screen.queryByText("Test Question");
    expect(visibleLabel).not.toBeInTheDocument();

    // Check that label is still present for accessibility
    const radioGroup = screen.getByRole("radiogroup", {
      name: "Test Question",
    });
    expect(radioGroup).toBeInTheDocument();
  });

  it("allows selecting yes or no", async () => {
    render(<YesNoField {...defaultProps} />);

    const yesOption = screen.getByRole("radio", { name: "Yes" });
    const noOption = screen.getByRole("radio", { name: "No" });

    await userEvent.click(yesOption);
    expect(yesOption).toBeChecked();
    expect(noOption).not.toBeChecked();

    await userEvent.click(noOption);
    expect(yesOption).not.toBeChecked();
    expect(noOption).toBeChecked();
  });

  it("supports optional children", () => {
    render(
      <YesNoField {...defaultProps}>
        <div data-testid="child-component">Additional Info</div>
      </YesNoField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
