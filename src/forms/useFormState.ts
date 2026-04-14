import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createActor } from "xstate";
import { getFormProgress, saveFormProgress } from "../db/database";
import {
  createFormMachine,
  type FormMachine,
  getPhase,
} from "./createFormMachine";
import {
  findNextStepIndex,
  findPrevStepIndex,
  getVisibleStepIds,
} from "./formVisibility";
import type { FormMachineContext, FormPhase, Step } from "./types";

type FormActor = ReturnType<typeof createActor<FormMachine>>;
type FormSnapshot = ReturnType<FormActor["getSnapshot"]>;

export interface UseFormStateReturn {
  /** Whether the hook is still loading persisted state from IndexedDB. */
  isLoading: boolean;
  /** The current top-level machine phase (title, filling, review, etc.). */
  phase: FormPhase;
  /** Send an event to the machine. */
  send: FormActor["send"];
  /** The active step (for filling/editing phases), or null. */
  activeStep: Step | null;
  /** The active step ID, or null. */
  activeStepId: string | null;
  /** 1-based index of the current step among visible steps (0 for title/review). */
  currentStepIndex: number;
  /** Total number of visible form steps. */
  totalSteps: number;
  /** All steps. */
  steps: readonly Step[];
  /** Navigate forward, evaluating guards with live form data. */
  goNext: () => void;
  /** Navigate backward, evaluating guards with live form data. */
  goBack: () => void;
}

// Loads a persisted XState snapshot from IndexedDB for the given form.
function usePersistedSnapshot(formSlug: string) {
  const [savedSnapshot, setSavedSnapshot] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof indexedDB === "undefined") {
      setIsLoading(false);
      return;
    }

    getFormProgress(formSlug)
      .then((snapshot) => {
        if (snapshot) setSavedSnapshot(snapshot);
      })
      .catch((error) => {
        console.error(
          `Failed to load form progress for "${formSlug}" from IndexedDB:`,
          error,
        );
      })
      .finally(() => setIsLoading(false));
  }, [formSlug]);

  return { isLoading, savedSnapshot };
}

// Creates the XState actor, restores it from a snapshot if available,
// and persists each state transition back to IndexedDB.
function useFormActor(
  machine: FormMachine,
  savedSnapshot: unknown,
  isLoading: boolean,
  formSlug: string,
) {
  const actorRef = useRef<FormActor | null>(null);
  const [state, setState] = useState<FormSnapshot | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const actor = createActor(machine, {
      ...(savedSnapshot ? { snapshot: savedSnapshot as any } : {}),
    });

    actorRef.current = actor;

    const canPersist = typeof indexedDB !== "undefined";

    const subscription = actor.subscribe((snapshot) => {
      setState(snapshot);
      if (!canPersist) return;
      const slug = (snapshot.context as FormMachineContext).formSlug;
      saveFormProgress(slug, actor.getPersistedSnapshot()).catch((error) => {
        console.error(
          `Failed to save form progress for "${slug}" to IndexedDB:`,
          error,
        );
      });
    });

    actor.start();
    setState(actor.getSnapshot());

    if (canPersist) {
      saveFormProgress(formSlug, actor.getPersistedSnapshot()).catch(
        (error) => {
          console.error(
            `Failed to save initial form progress for "${formSlug}" to IndexedDB:`,
            error,
          );
        },
      );
    }

    return () => {
      subscription.unsubscribe();
      actor.stop();
      actorRef.current = null;
    };
  }, [isLoading, savedSnapshot, machine, formSlug]);

  const send: FormActor["send"] = useCallback((event) => {
    actorRef.current?.send(event);
  }, []);

  return { actorRef, state, send };
}

export function useFormState(
  formSlug: string,
  steps: readonly Step[],
  getFormData: () => Record<string, any>,
): UseFormStateReturn {
  const machine = useMemo(
    () => createFormMachine({ id: formSlug, steps }),
    [formSlug, steps],
  );

  const { isLoading, savedSnapshot } = usePersistedSnapshot(formSlug);
  const { actorRef, state, send } = useFormActor(
    machine,
    savedSnapshot,
    isLoading,
    formSlug,
  );

  const context = state?.context as FormMachineContext | undefined;
  const phase = state ? getPhase(state.value) : "title";

  const activeStepId =
    phase === "editing"
      ? (context?.editingStepId ?? null)
      : (context?.currentStepId ?? null);

  const activeStep = steps.find((s) => s.id === activeStepId) ?? null;

  const visibleStepIds = getVisibleStepIds(steps, getFormData());

  const currentStepIndex = activeStepId
    ? visibleStepIds.indexOf(activeStepId) + 1
    : 0;

  const totalSteps = visibleStepIds.length;

  const goNext = useCallback(() => {
    const currentId = actorRef.current?.getSnapshot().context.currentStepId;
    if (!currentId) return;
    const currentIndex = steps.findIndex((s) => s.id === currentId);
    if (currentIndex === -1) return;

    const visible = getVisibleStepIds(steps, getFormData());
    const nextIndex = findNextStepIndex(steps, currentIndex, visible);
    const isLastStep = nextIndex === -1;
    if (isLastStep) {
      send({ type: "GOTO_REVIEW" });
    } else {
      send({ type: "GOTO_STEP", stepId: steps[nextIndex].id });
    }
  }, [steps, getFormData, send, actorRef]);

  const goBack = useCallback(() => {
    const snapshot = actorRef.current?.getSnapshot();
    const currentId = snapshot?.context.currentStepId;
    if (!currentId) return;

    if (snapshot?.value === "review") {
      send({ type: "GOTO_STEP", stepId: currentId });
      return;
    }

    const currentIndex = steps.findIndex((s) => s.id === currentId);
    if (currentIndex === -1) return;

    const visible = getVisibleStepIds(steps, getFormData());
    const prevIndex = findPrevStepIndex(steps, currentIndex, visible);
    const isFirstStep = prevIndex === -1;
    if (isFirstStep) {
      send({ type: "GOTO_TITLE" });
    } else {
      send({ type: "GOTO_STEP", stepId: steps[prevIndex].id });
    }
  }, [steps, getFormData, send, actorRef]);

  return {
    isLoading,
    phase,
    send,
    activeStep,
    activeStepId,
    currentStepIndex,
    totalSteps,
    steps,
    goNext,
    goBack,
  };
}
