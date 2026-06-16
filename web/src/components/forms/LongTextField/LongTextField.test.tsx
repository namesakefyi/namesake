import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { LongTextField } from "./LongTextField";

describe("LongTextField", () => {
  it("renders long text field", () => {
    renderWithFormProvider(
      <LongTextField
        label="Reason for changing name"
        name="reasonForChangingName"
      />,
    );

    const customField = screen.getByLabelText("Reason for changing name");

    expect(customField).toBeInTheDocument();
  });

  it("supports optional description", () => {
    renderWithFormProvider(
      <LongTextField
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
      <LongTextField
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
      <LongTextField
        label="Reason for changing name"
        name="reasonForChangingName"
      >
        <div data-testid="child-component">Additional Info</div>
      </LongTextField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
