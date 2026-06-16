import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { ShortTextField } from "./ShortTextField";

describe("ShortTextField", () => {
  it("renders field", () => {
    renderWithFormProvider(
      <ShortTextField
        label="Reason for changing name"
        name="reasonForChangingName"
      />,
    );

    const customField = screen.getByLabelText("Reason for changing name");
    expect(customField).toBeInTheDocument();
    expect(customField).toHaveAttribute("name", "reasonForChangingName");
  });

  it("supports optional description", () => {
    renderWithFormProvider(
      <ShortTextField
        label="Reason for changing name"
        name="reasonForChangingName"
        description="A custom description"
      />,
    );

    const description = screen.getByText("A custom description");
    expect(description).toBeInTheDocument();
  });

  it("allows entering text", async () => {
    renderWithFormProvider(
      <ShortTextField
        label="Reason for changing name"
        name="reasonForChangingName"
      />,
    );

    const customField = screen.getByLabelText("Reason for changing name");
    await userEvent.type(customField, "Hello, world!");
    expect(customField).toHaveValue("Hello, world!");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <ShortTextField
        label="Reason for changing name"
        name="reasonForChangingName"
      >
        <div data-testid="child-component">Additional Info</div>
      </ShortTextField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
