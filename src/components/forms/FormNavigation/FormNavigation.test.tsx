import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  FormStepContext,
  type FormStepContextValue,
} from "../FormContainer/FormStepContext";
import { FormNavigation } from "./FormNavigation";

const defaultContext: FormStepContextValue = {
  formTitle: "Court Order MA",
  currentStepIndex: 1,
  totalSteps: 4,
  phase: "filling",
  onNext: vi.fn(),
  onBack: vi.fn(),
  onSubmit: vi.fn(),
  onEditStep: vi.fn(),
  submitError: null,
};

function makeWrapper(
  overrides: Partial<typeof defaultContext> = {},
): ({ children }: { children: ReactNode }) => ReactNode {
  return ({ children }) => (
    <FormStepContext.Provider value={{ ...defaultContext, ...overrides }}>
      {children}
    </FormStepContext.Provider>
  );
}

describe("FormNavigation", () => {
  describe("navigation buttons", () => {
    it("calls onBack when the previous step button is pressed", async () => {
      const onBack = vi.fn();
      render(<FormNavigation />, { wrapper: makeWrapper({ onBack }) });

      await userEvent.click(
        screen.getByRole("button", { name: "Previous step" }),
      );

      expect(onBack).toHaveBeenCalledOnce();
    });

    it("calls onNext when the next step button is pressed", async () => {
      const onNext = vi.fn();
      render(<FormNavigation />, { wrapper: makeWrapper({ onNext }) });

      await userEvent.click(screen.getByRole("button", { name: "Next step" }));

      expect(onNext).toHaveBeenCalledOnce();
    });

    it("disables the next step button on the review step", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ phase: "review" }),
      });

      expect(screen.getByRole("button", { name: "Next step" })).toBeDisabled();
    });

    it("enables the next step button on regular steps", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ phase: "filling" }),
      });

      expect(
        screen.getByRole("button", { name: "Next step" }),
      ).not.toBeDisabled();
    });
  });

  describe("progress bar", () => {
    it("labels the progress bar with the form title", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ formTitle: "Social Security" }),
      });

      expect(
        screen.getByRole("progressbar", { name: "Social Security" }),
      ).toBeInTheDocument();
    });
  });
});
