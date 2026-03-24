import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import type { FormPhase, Step } from "@/forms/types";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormStep, FormSubsection, useFieldVisible } from "./FormStep";

const defaultContextValue = {
  onNext: vi.fn(),
  onBack: vi.fn(),
  formTitle: "Test Form",
  phase: "filling" as FormPhase,
  currentStepIndex: 2,
  totalSteps: 5,
  onSubmit: vi.fn(),
  onEditStep: vi.fn(),
  submitError: null,
};

function makeWrapper(
  overrides: Partial<typeof defaultContextValue> = {},
  formDefaultValues: Record<string, unknown> = {},
): ({ children }: { children: ReactNode }) => ReactNode {
  return ({ children }) => {
    const form = useForm({ defaultValues: formDefaultValues });
    return (
      <FormProvider {...form}>
        <FormStepContext.Provider
          value={{ ...defaultContextValue, ...overrides }}
        >
          {children}
        </FormStepContext.Provider>
      </FormProvider>
    );
  };
}

const TestWrapper = makeWrapper();

describe("FormStep", () => {
  const formStep: Step = {
    id: "what-is-your-legal-name",
    component: () => <div>Test content</div>,
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
    fields: [],
  };

  it("renders title correctly", () => {
    render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });

    const titleElement = screen.getByText(formStep.title as string);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("form-step-title");
  });

  it("renders optional description", () => {
    render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });

    const descriptionElement = screen.getByText(formStep.description as string);
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders dynamic title and description from form data", () => {
    const stepWithDynamicContent: Step = {
      ...formStep,
      title: (data) =>
        `Where do ${(data as { oldFirstName?: string }).oldFirstName ?? "the minor"}'s parents live?`,
      description: (data) =>
        `Enter the address for ${(data as { oldFirstName?: string }).oldFirstName ?? "the minor"}'s legal parents.`,
    };
    const WrapperWithData = makeWrapper({}, { oldFirstName: "Erika" });

    render(<FormStep stepConfig={stepWithDynamicContent} />, {
      wrapper: WrapperWithData,
    });

    expect(
      screen.getByText(
        (content) =>
          content.includes("Where do") &&
          content.includes("Erika") &&
          content.includes("parents live"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) =>
          content.includes("Enter the address for") &&
          content.includes("Erika") &&
          content.includes("legal parents"),
      ),
    ).toBeInTheDocument();
  });

  it("uses fallback when form data is empty for dynamic title", () => {
    const stepWithDynamicContent: Step = {
      ...formStep,
      title: (data) =>
        `Where do ${(data as { oldFirstName?: string }).oldFirstName ?? "the minor"}'s parents live?`,
    };

    render(<FormStep stepConfig={stepWithDynamicContent} />, {
      wrapper: TestWrapper,
    });

    expect(
      screen.getByText(
        (content) =>
          content.includes("Where do") &&
          content.includes("the minor") &&
          content.includes("parents live"),
      ),
    ).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const stepWithoutDescription: Step = {
      ...formStep,
      description: undefined,
    };

    render(<FormStep stepConfig={stepWithoutDescription} />, {
      wrapper: TestWrapper,
    });

    const titleElement = screen.getByText(formStep.title as string);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });

  it("associates the form with the title", () => {
    render(<FormStep stepConfig={formStep} />, {
      wrapper: TestWrapper,
    });
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-labelledby", "what-is-your-legal-name");
    const header = screen.getByRole("heading");
    expect(header).toHaveAttribute("id", "what-is-your-legal-name");
  });

  it("omits apostrophes from the id", () => {
    const stepWithApostrophe: Step = {
      ...formStep,
      id: "reason",
      title: "What is the reason you're changing your name?",
    };

    render(<FormStep stepConfig={stepWithApostrophe} />, {
      wrapper: TestWrapper,
    });
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute(
      "aria-labelledby",
      "what-is-the-reason-youre-changing-your-name",
    );
  });

  it("has accessible description when description is provided", () => {
    render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });

    const form = screen.getByRole("form", {
      description: formStep.description as string,
    });
    expect(form).toBeInTheDocument();
  });

  it("has no accessible description when description is omitted", () => {
    const stepWithoutDescription: Step = {
      ...formStep,
      description: undefined,
    };

    render(<FormStep stepConfig={stepWithoutDescription} />, {
      wrapper: TestWrapper,
    });

    const form = screen.getByRole("form", {
      name: formStep.title as string,
    });
    expect(form).toBeInTheDocument();
    expect(form).not.toHaveAccessibleDescription();
  });

  describe("form submission", () => {
    it("calls onSubmit when not in reviewing mode", () => {
      const onSubmit = vi.fn();
      render(<FormStep stepConfig={formStep} />, {
        wrapper: makeWrapper({ onSubmit, phase: "filling" }),
      });

      fireEvent.submit(screen.getByRole("form"));

      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("calls onSubmit when in reviewing mode (machine handles routing)", () => {
      const onSubmit = vi.fn();
      render(<FormStep stepConfig={formStep} />, {
        wrapper: makeWrapper({ onSubmit, phase: "editing" }),
      });

      fireEvent.submit(screen.getByRole("form"));

      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("prevents the default form submission", () => {
      render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });
      const form = screen.getByRole("form");
      const event = fireEvent.submit(form);

      expect(event).toBe(false);
    });
  });
});

describe("useFieldVisible", () => {
  function TestWrapper({ children }: { children: ReactNode }) {
    const form = useForm({ defaultValues: { middleName: "Lee" } });
    return <FormProvider {...form}>{children}</FormProvider>;
  }

  const stepConfig: Step = {
    id: "name",
    title: "Name",
    fields: ["middleName" as any],
    component: () => null,
  };

  it("returns true when field has no when callback", () => {
    const { result } = renderHook(
      () => useFieldVisible(stepConfig, "middleName" as any),
      { wrapper: TestWrapper },
    );
    expect(result.current).toBe(true);
  });

  it("returns true when when callback returns true", () => {
    const config: Step = {
      ...stepConfig,
      fields: [{ id: "middleName" as any, when: () => true }],
    };
    const { result } = renderHook(
      () => useFieldVisible(config, "middleName" as any),
      { wrapper: TestWrapper },
    );
    expect(result.current).toBe(true);
  });

  it("returns false when when callback returns false", () => {
    const config: Step = {
      ...stepConfig,
      fields: [{ id: "middleName" as any, when: () => false }],
    };
    const { result } = renderHook(
      () => useFieldVisible(config, "middleName" as any),
      { wrapper: TestWrapper },
    );
    expect(result.current).toBe(false);
  });

  it("passes live form data to the when callback", () => {
    const when = vi.fn(() => true);
    const config: Step = {
      ...stepConfig,
      fields: [{ id: "middleName" as any, when }],
    };
    renderHook(() => useFieldVisible(config, "middleName" as any), {
      wrapper: TestWrapper,
    });
    expect(when).toHaveBeenCalledWith(
      expect.objectContaining({ middleName: "Lee" }),
    );
  });

  it("returns false for a field not listed in the step fields", () => {
    const { result } = renderHook(
      () => useFieldVisible(stepConfig, "unknownField" as any),
      { wrapper: TestWrapper },
    );
    expect(result.current).toBe(false);
  });
});

describe("FormSubsection", () => {
  it("renders title", () => {
    render(<FormSubsection title="What is your legal name?" />);

    const titleElement = screen.getByText("What is your legal name?");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("react-aria-Heading");
  });

  it("does not render title when not provided", () => {
    render(<FormSubsection title={undefined} />);

    const titleElement = screen.queryByText("What is your legal name?");
    expect(titleElement).toBeNull();
  });

  it("renders children", () => {
    render(
      <FormSubsection title="What is your legal name?">
        <div>Test content</div>
      </FormSubsection>,
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(
      <FormSubsection title="What is your legal name?" isVisible={false} />,
    );

    const titleElement = screen.queryByText("What is your legal name?");
    expect(titleElement).toBeNull();
  });
});
