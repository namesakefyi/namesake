import { assign, setup } from "xstate";
import type {
  FormMachineContext,
  FormMachineEvent,
  FormPhase,
  Step,
} from "./types";

interface CreateFormMachineOptions {
  id: string;
  steps: readonly Step[];
}

export type FormMachine = ReturnType<typeof createFormMachine>;

/**
 * Creates a flat state machine for a multi-step form.
 *
 * Navigation between steps is driven externally: the caller computes the
 * target step using `findNextStepIndex` / `findPrevStepIndex` and dispatches
 * `GOTO_STEP`, `GOTO_REVIEW`, or `GOTO_TITLE`. This keeps guard evaluation
 * (which depends on live form data) outside the machine.
 */
export function createFormMachine({ id, steps }: CreateFormMachineOptions) {
  const firstStepId = steps[0].id;

  return setup({
    types: {
      context: {} as FormMachineContext,
      events: {} as FormMachineEvent,
    },
  }).createMachine({
    id,
    initial: "title",
    context: {
      formSlug: id,
      currentStepId: null,
      editingStepId: null,
    },
    states: {
      title: {
        on: {
          START: {
            target: "filling",
            actions: assign({ currentStepId: firstStepId }),
          },
        },
      },
      filling: {
        on: {
          GOTO_STEP: {
            actions: assign({
              currentStepId: ({ event }) => event.stepId,
            }),
          },
          GOTO_REVIEW: "review",
          GOTO_TITLE: "title",
        },
      },
      review: {
        on: {
          EDIT_STEP: {
            target: "editing",
            actions: assign({
              editingStepId: ({ event }) =>
                event.type === "EDIT_STEP" ? event.stepId : null,
            }),
          },
          SUBMIT: "submitting",
          GOTO_STEP: {
            target: "filling",
            actions: assign({
              currentStepId: ({ event }) => event.stepId,
            }),
          },
        },
      },
      editing: {
        on: {
          SAVE_EDIT: {
            target: "review",
            actions: assign({ editingStepId: null }),
          },
        },
      },
      submitting: {
        on: {
          SUBMIT_DONE: "complete",
          SUBMIT_ERROR: "review",
        },
      },
      complete: {
        type: "final",
      },
    },
  });
}

/**
 * Extracts the top-level phase from a machine state value.
 */
export function getPhase(stateValue: unknown): FormPhase {
  if (typeof stateValue === "string") return stateValue as FormPhase;
  if (typeof stateValue === "object" && stateValue !== null) {
    return Object.keys(stateValue)[0] as FormPhase;
  }
  return "title";
}
