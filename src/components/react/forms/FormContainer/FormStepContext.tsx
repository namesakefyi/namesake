import { createContext, useContext } from "react";
import type { FormPhase } from "@/forms/types";
import type { Costs } from "@/utils/formatTotalCosts";

export interface FormStepContextValue {
  onNext: () => void;
  onBack: () => void;
  /** The title of the form */
  formTitle: string;
  /** The description of the form */
  formDescription?: string | null;
  /** The current step index (1-based for actual form steps, 0 for title/review) */
  currentStepIndex: number;
  /** The total number of form steps (excludes skipped steps) */
  totalSteps: number;
  /** The current top-level machine state */
  phase: FormPhase;
  /** Submit handler for form steps */
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  /** Navigate to a step from the review screen for editing */
  onEditStep: (stepId: string) => void;
  /** Error message from the most recent failed submission attempt, if any */
  submitError: string | null;
  /** The costs associated with this form */
  costs?: Costs;
}

export const FormStepContext = createContext<FormStepContextValue | null>(null);

export function useFormStep() {
  const context = useContext(FormStepContext);
  if (!context) {
    throw new Error("useFormStep must be used within a FormContainer");
  }
  return context;
}
