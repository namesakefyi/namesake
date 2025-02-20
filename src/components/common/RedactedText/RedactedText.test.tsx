import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RedactedText } from "./RedactedText";

describe("RedactedText", () => {
  it("renders children text as redacted initially", () => {
    render(<RedactedText>Secret text</RedactedText>);

    const button = screen.getByRole("button", { name: "Reveal spoiler" });
    const text = screen.getByText("Secret text");

    expect(button).toBeInTheDocument();
    expect(text).toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveClass("[&>mark]:bg-gray-9", "[&>mark]:text-gray-9");
  });

  it("reveals text when clicked", async () => {
    const user = userEvent.setup();
    render(<RedactedText>Secret text</RedactedText>);

    const button = screen.getByRole("button");
    await user.click(button);

    const text = screen.getByText("Secret text");
    expect(text).toHaveAttribute("aria-hidden", "false");
    expect(button).toHaveClass("[&>mark]:bg-transparent");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("reveals text when pressing Enter", async () => {
    const user = userEvent.setup();
    render(<RedactedText>Secret text</RedactedText>);

    const button = screen.getByRole("button");
    await user.type(button, "{Enter}");

    const text = screen.getByText("Secret text");
    expect(text).toHaveAttribute("aria-hidden", "false");
  });

  it("reveals text when pressing Space", async () => {
    const user = userEvent.setup();
    render(<RedactedText>Secret text</RedactedText>);

    const button = screen.getByRole("button");
    await user.type(button, " ");

    const text = screen.getByText("Secret text");
    expect(text).toHaveAttribute("aria-hidden", "false");
  });

  it("applies custom className", () => {
    render(<RedactedText className="custom-class">Secret text</RedactedText>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("returns null when children is empty", () => {
    const { container } = render(<RedactedText>{""}</RedactedText>);
    expect(container).toBeEmptyDOMElement();
  });
});
