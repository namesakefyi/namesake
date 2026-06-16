import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { FieldButton, Form, Label } from "./Form";

describe("Form", () => {
  it("renders a form element", () => {
    render(<Form aria-label="Test form" />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Form aria-label="Test form">
        <input aria-label="Name" />
      </Form>,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("forwards a ref to the form element", () => {
    const ref = createRef<HTMLFormElement>();
    render(<Form ref={ref} aria-label="Test form" />);
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });

  it("forwards additional props to the form element", () => {
    render(<Form aria-label="Test form" data-testid="my-form" />);
    expect(screen.getByTestId("my-form")).toBeInTheDocument();
  });
});

describe("Label", () => {
  it("renders label text", () => {
    render(
      <form>
        <Label htmlFor="name">Full name</Label>
        <input id="name" />
      </form>,
    );
    expect(screen.getByText("Full name")).toBeInTheDocument();
  });

  it("is associated with its input", () => {
    render(
      <form>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </form>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});

describe("FieldButton", () => {
  it("renders a button", () => {
    render(<FieldButton>Clear</FieldButton>);
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("applies the namesake-field-button class", () => {
    render(<FieldButton>Clear</FieldButton>);
    expect(screen.getByRole("button")).toHaveClass("namesake-field-button");
  });

  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    render(<FieldButton onPress={onPress}>Clear</FieldButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("forwards additional props to the button", () => {
    render(<FieldButton data-testid="field-btn">Clear</FieldButton>);
    expect(screen.getByTestId("field-btn")).toBeInTheDocument();
  });
});
