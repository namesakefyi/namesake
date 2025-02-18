import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RedactedName } from "./RedactedName";

describe("RedactedName", () => {
  it("renders with masked text by default", () => {
    render(<RedactedName>John Doe</RedactedName>);
    const text = screen.getByText("John Doe");
    expect(text.parentElement).toHaveClass("text-transparent");
    expect(text).toHaveAttribute("aria-hidden", "true");
  });

  it("toggles visibility and aria-hidden when button is clicked", async () => {
    const user = userEvent.setup();
    render(<RedactedName>John Doe</RedactedName>);

    const button = screen.getByRole("button");
    const text = screen.getByText("John Doe");

    // Initially masked and hidden from screen readers
    expect(text).toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAccessibleName("Show Deadname");

    // Reveal text
    await user.click(button);
    expect(text).toHaveAttribute("aria-hidden", "false");
    expect(button).toHaveAccessibleName("Hide Deadname");

    // Mask text again
    await user.click(button);
    expect(text).toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAccessibleName("Show Deadname");
  });

  it("returns null if no text is provided", () => {
    const { container } = render(<RedactedName>{""}</RedactedName>);
    expect(container).toBeEmptyDOMElement();
  });
});
