import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormReviewStep } from "./FormReviewStep";

// Test wrapper that provides form context and FormStepContext
function TestWrapper({
  children,
  phase = "review",
  submitError = null,
  onSubmit = vi.fn(),
}: {
  children: React.ReactNode;
  phase?: "review" | "submitting";
  submitError?: string | null;
  onSubmit?: (event: React.SubmitEvent<HTMLFormElement>) => void;
}) {
  const form = useForm();
  return (
    <FormProvider {...form}>
      <FormStepContext.Provider
        value={{
          onNext: vi.fn(),
          onBack: vi.fn(),
          formTitle: "Test Form",
          currentStepIndex: 0,
          totalSteps: 5,
          phase,
          onSubmit,
          onEditStep: vi.fn(),
          submitError,
        }}
      >
        {children}
      </FormStepContext.Provider>
    </FormProvider>
  );
}

describe("FormReviewStep", () => {
  it("renders with default title", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    expect(screen.getByText("Review your information")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    expect(
      screen.getByText(
        /Please review your answers before submitting. Once submitted, completed forms will download automatically./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders submit button with icon", () => {
    render(<FormReviewStep steps={[]} />, {
      wrapper: TestWrapper,
    });

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    expect(button).toBeInTheDocument();

    // Check if icon is present (RiDownloadLine)
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("button click triggers form submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <TestWrapper onSubmit={handleSubmit}>
        <FormReviewStep steps={[]} />
      </TestWrapper>,
    );

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("shows pending state on submit button when submitting", () => {
    render(<FormReviewStep steps={[]} />, {
      wrapper: ({ children }) => (
        <TestWrapper phase="submitting">{children}</TestWrapper>
      ),
    });

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    expect(button).toBeDisabled();
  });

  it("sets aria-busy on the form when submitting", () => {
    render(<FormReviewStep steps={[]} />, {
      wrapper: ({ children }) => (
        <TestWrapper phase="submitting">{children}</TestWrapper>
      ),
    });

    const form = document.querySelector(".form-review-step");
    expect(form).toHaveAttribute("aria-busy", "true");
  });

  it("makes review content inert when submitting", () => {
    render(<FormReviewStep steps={[]} />, {
      wrapper: ({ children }) => (
        <TestWrapper phase="submitting">{children}</TestWrapper>
      ),
    });

    const content = document.querySelector(".form-review-step-content");
    expect(content).toHaveAttribute("inert");
  });

  it("does not show error banner when there is no submit error", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows error banner when submit error is present", () => {
    render(<FormReviewStep steps={[]} />, {
      wrapper: ({ children }) => (
        <TestWrapper submitError="Something went wrong while generating your download. Please try again.">
          {children}
        </TestWrapper>
      ),
    });

    const banner = screen.getByRole("alert");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(
      "Something went wrong while generating your download. Please try again.",
    );
  });
});
