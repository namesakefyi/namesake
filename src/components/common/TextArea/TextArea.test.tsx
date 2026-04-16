import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  it("renders a textbox", () => {
    render(<TextArea label="Notes" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    render(<TextArea label="Notes" />);
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("associates the label with the textarea", () => {
    render(<TextArea label="Notes" />);
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  });

  it("renders without a label element when label is omitted", () => {
    render(<TextArea aria-label="Notes" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("renders description text when provided", () => {
    render(<TextArea label="Notes" description="Enter any additional notes" />);
    // React Aria duplicates description text in a hidden SSR template
    expect(
      screen.getAllByText("Enter any additional notes").length,
    ).toBeGreaterThan(0);
  });

  it("renders an error message when isInvalid is true", () => {
    render(
      <TextArea
        label="Notes"
        errorMessage="This field is required"
        isInvalid
      />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("pre-fills from defaultValue", () => {
    render(<TextArea label="Notes" defaultValue="Initial text" />);
    expect(screen.getByRole("textbox")).toHaveValue("Initial text");
  });

  it("updates the value as the user types", async () => {
    render(<TextArea label="Notes" />);
    await userEvent.type(screen.getByRole("textbox"), "Hello");
    expect(screen.getByRole("textbox")).toHaveValue("Hello");
  });

  it("calls onChange with the new value as the user types", async () => {
    const onChange = vi.fn();
    render(<TextArea label="Notes" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "Hi");
    expect(onChange).toHaveBeenLastCalledWith("Hi");
  });

  it("renders as disabled", () => {
    render(<TextArea label="Notes" isDisabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("does not accept input when disabled", async () => {
    render(<TextArea label="Notes" isDisabled />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("renders as readonly", () => {
    render(<TextArea label="Notes" isReadOnly defaultValue="Read only text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("does not change value when readonly", async () => {
    render(<TextArea label="Notes" isReadOnly defaultValue="Read only text" />);
    await userEvent.type(screen.getByRole("textbox"), " extra");
    expect(screen.getByRole("textbox")).toHaveValue("Read only text");
  });

  it("forwards the ref to the underlying textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea label="Notes" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
