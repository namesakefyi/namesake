import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RedactedText } from "./RedactedText";

describe("RedactedText", () => {
  it("renders text as redacted initially", () => {
    render(<RedactedText>Secret text</RedactedText>);

    const checkbox = screen.getByRole("checkbox", { name: "Reveal spoiler" });
    const text = screen.getByText("Secret text");
    const hiddenAnnouncement = screen.getByText(
      "Spoiler text hidden. Check checkbox to reveal.",
    );

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(text).toHaveAttribute("aria-hidden", "true");
    expect(text).toHaveClass("bg-gray-9", "text-gray-9");
    expect(hiddenAnnouncement).toHaveClass("sr-only");
  });

  it("reveals text when clicked", async () => {
    const user = userEvent.setup();
    render(<RedactedText>Secret text</RedactedText>);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    const text = screen.getByText("Secret text");
    const revealedAnnouncement = screen.getByText(
      "Spoiler text revealed: Secret text",
    );

    expect(checkbox).toBeChecked();
    expect(text).toHaveAttribute("aria-hidden", "false");
    expect(text).toHaveClass("bg-transparent");
    expect(revealedAnnouncement).toHaveClass("sr-only");
  });

  it("reveals text when pressing Enter", async () => {
    const user = userEvent.setup();
    render(<RedactedText>Secret text</RedactedText>);

    const checkbox = screen.getByRole("checkbox");
    await user.type(checkbox, "{Enter}");

    const text = screen.getByText("Secret text");
    expect(text).toHaveAttribute("aria-hidden", "false");
  });

  it("applies custom className", () => {
    render(<RedactedText className="custom-class">Secret text</RedactedText>);

    const wrapper = screen.getByRole("checkbox").closest("label");
    expect(wrapper).toHaveClass("custom-class");
  });

  it("returns null when children is empty", () => {
    const { container } = render(<RedactedText>{""}</RedactedText>);
    expect(container).toBeEmptyDOMElement();
  });
});
