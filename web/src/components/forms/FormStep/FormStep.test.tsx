import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { isTrue } from "#lib/forms/conditions";
import { block, field } from "#lib/forms/steps";
import type { FormPhase, Step } from "#lib/forms/types";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormStep } from "./FormStep";
import { FormSubsection } from "./FormSubsection";
import { renderers } from "./renderers";

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
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
    body: [],
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
});

/** Renders a step inside a form, with answers already given. */
function renderStep(step: Step, defaultValues: Record<string, unknown> = {}) {
  return render(<FormStep stepConfig={step} />, {
    wrapper: makeWrapper({}, defaultValues),
  });
}

/** A fallback that registers a field it doesn't declare. */
function UndeclaredWriter() {
  useFormContext().register("email");
  return null;
}

describe("FormStep body", () => {
  it("renders each node and leaves hidden ones unmounted", async () => {
    const step: Step = {
      id: "previous-name",
      title: "Have you changed your name before?",
      body: [
        field.yesNo("hasPreviousNameChange"),
        block.subsection(
          [field.shortText("previousNameFrom", { label: "Previous name" })],
          { title: "Details", when: isTrue("hasPreviousNameChange") },
        ),
        block.banner("Read the [guide](https://example.com/guide).", {
          when: isTrue("hasPreviousNameChange"),
        }),
      ],
    };
    renderStep(step);

    expect(
      screen.getByRole("radiogroup", {
        name: "Have you changed your name before?",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Previous name")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));

    expect(screen.getByLabelText("Previous name")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "guide" })).toHaveAttribute(
      "href",
      "https://example.com/guide",
    );
  });

  it("escapes answers interpolated into banner content", () => {
    const step: Step = {
      id: "banner",
      title: "Banner",
      body: [block.banner((data) => `Hello, ${data.newFirstName}`)],
    };
    renderStep(step, { newFirstName: "<b>Sylvia</b>" });
    expect(screen.getByText("Hello, <b>Sylvia</b>")).toBeInTheDocument();
  });

  it("passes computed props to render overrides", () => {
    const render = vi.fn(({ label, field: bound }) => (
      <span>{`${label}: ${bound?.value}`}</span>
    ));
    const step: Step = {
      id: "override",
      title: "Override",
      body: [field.shortText("occupation", { label: "Job", render })],
    };
    renderStep(step, { occupation: "Baker" });
    expect(screen.getByText("Job: Baker")).toBeInTheDocument();
  });

  it("warns in development when a fallback writes an undeclared field", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const step: Step = {
      id: "custom",
      title: "Custom",
      body: [
        block.custom({
          writes: ["phoneNumber"],
          reviewLabels: { phoneNumber: "Phone number" },
          render: UndeclaredWriter,
        }),
      ],
    };
    renderStep(step);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('registers "email", which is not in its writes'),
    );
  });

  it("names every renderer after its builder", () => {
    for (const [kind, renderer] of Object.entries(renderers)) {
      expect(renderer.displayName).toBe(kind);
    }
  });
});
