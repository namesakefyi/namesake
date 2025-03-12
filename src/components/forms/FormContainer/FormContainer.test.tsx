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

    const title = screen.getByText("Test Title");

    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-5xl");
  });

  it("renders back button", async () => {
    render(<FormContainerWithForm />);

    const backButton = screen.getByLabelText("Save and exit");
    expect(backButton).toBeInTheDocument();
  });

  it("renders form navigation component", () => {
    render(<FormContainerWithForm />);

    // Check for navigation controls that FormNavigation renders
    expect(screen.getByLabelText("Previous question")).toBeInTheDocument();
    expect(screen.getByLabelText("Next question")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "All questions" }),
    ).toBeInTheDocument();
  });
});
