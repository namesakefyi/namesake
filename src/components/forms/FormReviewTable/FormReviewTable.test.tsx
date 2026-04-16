import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import type { Step } from "../../../forms/types";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormReviewTable } from "./FormReviewTable";

const defaultContextValue = {
  onNext: vi.fn(),
  onBack: vi.fn(),
  formTitle: "Test Form",
  phase: "review" as const,
  currentStepIndex: 0,
  totalSteps: 2,
  onSubmit: vi.fn(),
  onEditStep: vi.fn(),
  submitError: null,
};

function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const form = useForm({ defaultValues });
  return (
    <FormProvider {...form}>
      <FormStepContext.Provider value={defaultContextValue}>
        {children}
      </FormStepContext.Provider>
    </FormProvider>
  );
}

function renderWithValues(
  ui: ReactNode,
  defaultValues: Record<string, unknown> = {},
) {
  return render(<FormWrapper defaultValues={defaultValues}>{ui}</FormWrapper>);
}

const nameStep: Step = {
  id: "legal-name",
  title: "Legal Name",
  component: () => null,
  fields: ["oldFirstName", "oldLastName"],
};

const contactStep: Step = {
  id: "contact",
  title: "Contact",
  component: () => null,
  fields: ["phoneNumber"],
};

describe("FormReviewTable", () => {
  it("renders a field label and value for each visible field", () => {
    renderWithValues(<FormReviewTable steps={[nameStep]} />, {
      oldFirstName: "Sylvia",
      oldLastName: "Rivera",
    });

    const terms = screen.getAllByRole("term");
    const definitions = screen.getAllByRole("definition");

    expect(terms[0]).toHaveTextContent("Old first name:");
    expect(definitions[0]).toHaveTextContent("Sylvia");
    expect(terms[1]).toHaveTextContent("Old last name:");
    expect(definitions[1]).toHaveTextContent("Rivera");
  });

  it("shows a 'Missing!' marker for fields with no value", () => {
    renderWithValues(<FormReviewTable steps={[nameStep]} />, {
      oldFirstName: "Sylvia",
    });

    const definitions = screen.getAllByRole("definition");
    expect(definitions[0]).toHaveTextContent("Sylvia");
    expect(definitions[1]).toHaveTextContent("Missing!");
  });

  it("renders a Change button for each step section", () => {
    renderWithValues(<FormReviewTable steps={[nameStep]} />, {
      oldFirstName: "Sylvia",
    });

    const changeButton = screen.getByRole("button", { name: "Change" });
    expect(changeButton).toBeInTheDocument();
  });

  it("renders a section per step when multiple steps have visible fields", () => {
    renderWithValues(<FormReviewTable steps={[nameStep, contactStep]} />, {
      oldFirstName: "Sylvia",
      phoneNumber: "(555) 867-5309",
    });

    const changeButtons = screen.getAllByRole("button", { name: "Change" });
    expect(changeButtons).toHaveLength(2);
  });

  it("calls onEditStep with the step ID when Change is clicked", () => {
    const onEditStep = vi.fn();

    function Wrapper({ children }: { children: ReactNode }) {
      const form = useForm({ defaultValues: { oldFirstName: "Sylvia" } });
      return (
        <FormProvider {...form}>
          <FormStepContext.Provider
            value={{ ...defaultContextValue, onEditStep }}
          >
            {children}
          </FormStepContext.Provider>
        </FormProvider>
      );
    }

    render(<FormReviewTable steps={[nameStep]} />, { wrapper: Wrapper });

    screen.getByRole("button", { name: "Change" }).click();
    expect(onEditStep).toHaveBeenCalledWith("legal-name");
  });

  it("omits the colon separator when a label ends with a question mark", () => {
    const yesNoStep: Step = {
      id: "yes-no-step",
      title: "Yes/No",
      component: () => null,
      fields: ["hasCourtAppointedGuardian"],
    };

    renderWithValues(<FormReviewTable steps={[yesNoStep]} />, {
      hasCourtAppointedGuardian: true,
    });

    const term = screen.getByRole("term");
    expect(term).toHaveTextContent(/\?(?!.*:)/);
    expect(term).not.toHaveTextContent("?:");
  });

  it("skips steps where all fields are hidden by when callbacks", () => {
    const hiddenStep: Step = {
      ...nameStep,
      id: "hidden-step",
      fields: [
        { id: "oldFirstName", when: () => false },
        { id: "oldLastName", when: () => false },
      ],
    };

    renderWithValues(<FormReviewTable steps={[hiddenStep, contactStep]} />, {
      oldFirstName: "Sylvia",
      phoneNumber: "(555) 867-5309",
    });

    const changeButtons = screen.getAllByRole("button", { name: "Change" });
    expect(changeButtons).toHaveLength(1);
  });

  it("renders no sections when all steps have no visible fields", () => {
    const emptyStep: Step = {
      ...nameStep,
      fields: [
        { id: "oldFirstName", when: () => false },
        { id: "oldLastName", when: () => false },
      ],
    };

    renderWithValues(<FormReviewTable steps={[emptyStep]} />, {
      oldFirstName: "Sylvia",
    });

    expect(screen.queryAllByRole("term")).toHaveLength(0);
    expect(screen.queryAllByRole("definition")).toHaveLength(0);
  });

  it("only includes fields that are visible within a step", () => {
    const partialStep: Step = {
      ...nameStep,
      fields: ["oldFirstName", { id: "oldLastName", when: () => false }],
    };

    renderWithValues(<FormReviewTable steps={[partialStep]} />, {
      oldFirstName: "Sylvia",
      oldLastName: "Rivera",
    });

    const terms = screen.getAllByRole("term");
    const definitions = screen.getAllByRole("definition");

    expect(terms).toHaveLength(1);
    expect(terms[0]).toHaveTextContent("Old first name:");
    expect(definitions[0]).toHaveTextContent("Sylvia");
  });
});
