import userEvent from "@testing-library/user-event";
import { renderWithFormProvider, screen } from "@tests/test-utils";
import { describe, expect, it } from "vitest";
import {
  YesNoField,
  getBooleanValueFromYesNoString,
  getYesNoStringFromBoolean,
} from "./YesNoField";

describe("YesNoField", () => {
  it("renders with default labels", () => {
    renderWithFormProvider(
      <YesNoField
        name="isCurrentlyUnhoused"
        label="Are you currently unhoused?"
      />,
    );

    const label = screen.getByText("Are you currently unhoused?");
    const yesOption = screen.getByText("Yes");
    const noOption = screen.getByText("No");

    expect(label).toBeInTheDocument();
    expect(yesOption).toBeInTheDocument();
    expect(noOption).toBeInTheDocument();
  });

  it("supports custom labels", () => {
    renderWithFormProvider(
      <YesNoField
        name="isCurrentlyUnhoused"
        label="Are you currently unhoused?"
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
    renderWithFormProvider(
      <YesNoField
        name="isCurrentlyUnhoused"
        label="Are you currently unhoused?"
        labelHidden
      />,
    );

    const visibleLabel = screen.queryByText("Are you currently unhoused?");
    expect(visibleLabel).not.toBeInTheDocument();

    // Check that label is still present for accessibility
    const radioGroup = screen.getByRole("radiogroup", {
      name: "Are you currently unhoused?",
    });
    expect(radioGroup).toBeInTheDocument();
  });

  it("allows selecting yes or no", async () => {
    renderWithFormProvider(
      <YesNoField
        name="isCurrentlyUnhoused"
        label="Are you currently unhoused?"
      />,
    );

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
    renderWithFormProvider(
      <YesNoField
        name="isCurrentlyUnhoused"
        label="Are you currently unhoused?"
      >
        <div data-testid="child-component">Additional Info</div>
      </YesNoField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});

describe("getYesNoStringFromBoolean", () => {
  it("returns 'yes' if the value is true", () => {
    expect(getYesNoStringFromBoolean(true)).toBe("yes");
  });

  it("returns 'no' if the value is false", () => {
    expect(getYesNoStringFromBoolean(false)).toBe("no");
  });

  it("returns null if the value is undefined", () => {
    expect(getYesNoStringFromBoolean(undefined as any)).toBeNull();
  });

  it("returns null if the value is null", () => {
    expect(getYesNoStringFromBoolean(null as any)).toBeNull();
  });
});

describe("getBooleanValueFromYesNoString", () => {
  it("returns true if the value is 'yes'", () => {
    expect(getBooleanValueFromYesNoString("yes")).toBe(true);
  });

  it("returns false otherwise", () => {
    expect(getBooleanValueFromYesNoString("no")).toBe(false);
    expect(getBooleanValueFromYesNoString("")).toBe(false);
    expect(getBooleanValueFromYesNoString("garbage")).toBe(false);
    expect(getBooleanValueFromYesNoString(null as any)).toBe(false);
    expect(getBooleanValueFromYesNoString(undefined as any)).toBe(false);
  });
});
