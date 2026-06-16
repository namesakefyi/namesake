import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders a textbox", () => {
    render(<TextField label="First name" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    render(<TextField label="First name" />);
    expect(screen.getByText("First name")).toBeInTheDocument();
  });

  it("associates the label with the input", () => {
    render(<TextField label="First name" />);
    expect(
      screen.getByRole("textbox", { name: "First name" }),
    ).toBeInTheDocument();
  });

  it("renders description text when provided", () => {
    render(
      <TextField
        label="First name"
        description="Enter your legal first name"
      />,
    );
    // React Aria duplicates description text in a hidden SSR template
    expect(
      screen.getAllByText("Enter your legal first name").length,
    ).toBeGreaterThan(0);
  });

  it("renders an error message when isInvalid is true", () => {
    render(
      <TextField
        label="First name"
        errorMessage="This field is required"
        isInvalid
      />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("passes the size attribute to the input", () => {
    render(<TextField label="ZIP code" size={10} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("size", "10");
  });

  it("passes the type attribute to the input", () => {
    render(<TextField label="Email" type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("pre-fills from defaultValue", () => {
    render(<TextField label="First name" defaultValue="Sylvia" />);
    expect(screen.getByRole("textbox")).toHaveValue("Sylvia");
  });

  it("updates the value as the user types", async () => {
    render(<TextField label="First name" />);
    await userEvent.type(screen.getByRole("textbox"), "Rivera");
    expect(screen.getByRole("textbox")).toHaveValue("Rivera");
  });

  it("calls onChange with the new value as the user types", async () => {
    const onChange = vi.fn();
    render(<TextField label="First name" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "Hi");
    expect(onChange).toHaveBeenLastCalledWith("Hi");
  });

  it("renders as disabled", () => {
    render(<TextField label="First name" isDisabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("does not accept input when disabled", async () => {
    render(<TextField label="First name" isDisabled />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("renders as readonly", () => {
    render(<TextField label="First name" isReadOnly defaultValue="Sylvia" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("does not change value when readonly", async () => {
    render(<TextField label="First name" isReadOnly defaultValue="Sylvia" />);
    await userEvent.type(screen.getByRole("textbox"), " Rivera");
    expect(screen.getByRole("textbox")).toHaveValue("Sylvia");
  });
});
