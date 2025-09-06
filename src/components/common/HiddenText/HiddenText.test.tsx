import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HiddenText } from "./HiddenText";

describe("HiddenText", () => {
  it("renders text hidden by default", () => {
    render(<HiddenText>Secret text</HiddenText>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("title", "Hidden text, toggle to reveal");
    const text = screen.getByText("Secret text");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(text).toHaveAttribute("aria-hidden", "true");
    expect(text).toHaveClass("text-transparent");
  });

  it("prevents selecting hidden text", () => {
    render(<HiddenText>Secret text</HiddenText>);

    const wrapper = screen.getByRole("checkbox").closest("label");
    expect(wrapper).toHaveClass("select-none");
  });

  it("allows selecting revealed text", async () => {
    const user = userEvent.setup();
    render(<HiddenText>Secret text</HiddenText>);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    const wrapper = screen.getByRole("checkbox").closest("label");
    expect(wrapper).toHaveClass("cursor-text");
  });

  it("reveals text when clicked", async () => {
    const user = userEvent.setup();
    render(<HiddenText>Secret text</HiddenText>);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    const text = screen.getByText("Secret text");

    expect(checkbox).toBeChecked();
    expect(text).toHaveAttribute("aria-hidden", "false");
    expect(text).not.toHaveClass("text-transparent");
    expect(text).toHaveClass("bg-transparent");
  });

  it("reveals text when pressing spacebar on checkbox", async () => {
    const user = userEvent.setup();
    render(<HiddenText>Secret text</HiddenText>);

    const checkbox = screen.getByRole("checkbox");
    await act(async () => {
      checkbox.focus();
      await user.keyboard(" ");
    });

    const text = screen.getByText("Secret text");
    expect(text).toHaveAttribute("aria-hidden", "false");
    expect(text).not.toHaveClass("text-transparent");
    expect(text).toHaveClass("bg-transparent");
  });

  it("applies custom className", () => {
    render(<HiddenText className="custom-class">Secret text</HiddenText>);

    const wrapper = screen.getByRole("checkbox").closest("label");
    expect(wrapper).toHaveClass("custom-class");
  });

  it("returns null when children is empty", () => {
    const { container } = render(<HiddenText>{""}</HiddenText>);
    expect(container).toBeEmptyDOMElement();
  });
});
