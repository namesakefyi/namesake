import { FormContainer } from "@/components/forms";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

const FormContainerWithForm = () => {
  const form = useForm();
  return (
    <FormContainer title="Test Title" form={form} onSubmit={() => {}}>
      <div>Test Content</div>
    </FormContainer>
  );
};

describe("FormContainer", () => {
  it("renders children content", () => {
    render(<FormContainerWithForm />);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(<FormContainerWithForm />);

    const titles = screen.getAllByText("Test Title");

    expect(titles).toHaveLength(2);
    // First title is in the navigation
    // Second title is in the form container
    expect(titles[1]).toHaveClass("text-5xl");
  });

  it("renders form navigation component", () => {
    render(<FormContainerWithForm />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
