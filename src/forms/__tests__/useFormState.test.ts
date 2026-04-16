import { act, renderHook, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createActor } from "xstate";
import * as db from "../../db/database";
import { createFormMachine } from "../createFormMachine";
import type { Step } from "../types";
import { useFormState } from "../useFormState";

vi.mock("../../db/database", () => ({
  getFormProgress: vi.fn(),
  saveFormProgress: vi.fn(),
}));

function makeStep(id: string): Step {
  return { id, title: `Step ${id}`, fields: [], component: () => null };
}

const flow = [makeStep("a"), makeStep("b")];

const getFormData = () => ({});

describe("useFormState", () => {
  beforeAll(() => {
    if (typeof globalThis.indexedDB === "undefined") {
      Object.defineProperty(globalThis, "indexedDB", {
        value: {},
        writable: true,
      });
    }
  });

  beforeEach(() => {
    vi.mocked(db.getFormProgress).mockReset().mockResolvedValue(undefined);
    vi.mocked(db.saveFormProgress).mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial loading without indexedDB", () => {
    it("sets isLoading to false immediately when indexedDB is unavailable", async () => {
      const original = globalThis.indexedDB;
      // @ts-expect-error - simulating environment without IndexedDB
      globalThis.indexedDB = undefined;

      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      globalThis.indexedDB = original;
    });
  });

  describe("initial loading", () => {
    it("starts with isLoading true", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      expect(result.current.isLoading).toBe(true);

      await act(async () => {});
    });

    it("sets isLoading to false after progress check completes", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("starts in the title phase when no saved progress exists", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.phase).toBe("title");
    });
  });

  describe("restoring progress", () => {
    it("restores machine to a persisted filling state", async () => {
      const m = createFormMachine({ id: "test-form", steps: flow });
      const actor = createActor(m);
      actor.start();
      actor.send({ type: "START" });
      const snapshot = actor.getPersistedSnapshot();
      actor.stop();

      vi.mocked(db.getFormProgress).mockResolvedValueOnce(snapshot);

      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.phase).toBe("filling");
      expect(result.current.activeStepId).toBe("a");
    });

    it("restores machine to the review phase", async () => {
      const m = createFormMachine({ id: "test-form", steps: flow });
      const actor = createActor(m);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      const snapshot = actor.getPersistedSnapshot();
      actor.stop();

      vi.mocked(db.getFormProgress).mockResolvedValueOnce(snapshot);

      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.phase).toBe("review");
    });

    it("falls back to title when getFormProgress rejects", async () => {
      vi.mocked(db.getFormProgress).mockRejectedValueOnce(
        new Error("DB error"),
      );

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.phase).toBe("title");
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to load form progress for "test-form" from IndexedDB:',
        expect.any(Error),
      );
      consoleError.mockRestore();
    });
  });

  describe("saving progress", () => {
    it("persists the initial state on mount", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await waitFor(() => {
        expect(db.saveFormProgress).toHaveBeenCalledWith(
          "test-form",
          expect.objectContaining({ value: "title" }),
        );
      });
    });

    it("persists state after a transition", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.mocked(db.saveFormProgress).mockClear();

      act(() => {
        result.current.send({ type: "START" });
      });

      await waitFor(() => {
        expect(db.saveFormProgress).toHaveBeenCalledWith(
          "test-form",
          expect.objectContaining({ value: "filling" }),
        );
      });
    });

    it("persists state when navigating with goNext", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      vi.mocked(db.saveFormProgress).mockClear();

      act(() => {
        result.current.goNext();
      });

      expect(result.current.activeStepId).toBe("b");

      await waitFor(() => {
        expect(db.saveFormProgress).toHaveBeenCalled();
      });
    });
  });

  describe("persisting complete state", () => {
    it("persists the complete state so the user returns to the completion page", async () => {
      const singleFlow = [makeStep("only")];
      const m = createFormMachine({ id: "complete-test", steps: singleFlow });

      const actor = createActor(m);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      const submittingSnapshot = actor.getPersistedSnapshot();
      actor.stop();

      vi.mocked(db.getFormProgress).mockResolvedValueOnce(submittingSnapshot);

      const { result } = renderHook(() =>
        useFormState("complete-test", singleFlow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.mocked(db.saveFormProgress).mockClear();

      act(() => {
        result.current.send({ type: "SUBMIT_DONE" });
      });

      expect(result.current.phase).toBe("complete");

      await waitFor(() => {
        expect(db.saveFormProgress).toHaveBeenCalledWith(
          "complete-test",
          expect.objectContaining({ value: "complete" }),
        );
      });
    });
  });

  describe("navigation helpers", () => {
    it("goNext advances to the next step", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      expect(result.current.activeStepId).toBe("a");

      act(() => {
        result.current.goNext();
      });
      expect(result.current.activeStepId).toBe("b");
    });

    it("goNext goes to review when at the last step", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      act(() => {
        result.current.goNext();
      });
      expect(result.current.activeStepId).toBe("b");

      act(() => {
        result.current.goNext();
      });
      expect(result.current.phase).toBe("review");
    });

    it("goNext goes directly to review from a single-step flow (isLastStep = true)", async () => {
      const singleFlow = [makeStep("only")];

      const { result } = renderHook(() =>
        useFormState("single-step", singleFlow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      expect(result.current.activeStepId).toBe("only");

      act(() => {
        result.current.goNext();
      });
      expect(result.current.phase).toBe("review");
    });

    it("goBack goes to the previous step", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      act(() => {
        result.current.goNext();
      });
      expect(result.current.activeStepId).toBe("b");

      act(() => {
        result.current.goBack();
      });
      expect(result.current.activeStepId).toBe("a");
    });

    it("goBack goes to title when at the first step", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      expect(result.current.activeStepId).toBe("a");

      act(() => {
        result.current.goBack();
      });
      expect(result.current.phase).toBe("title");
    });

    it("goBack from review returns to the last filling step", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      act(() => {
        result.current.goNext();
      });
      act(() => {
        result.current.goNext();
      });
      expect(result.current.phase).toBe("review");

      act(() => {
        result.current.goBack();
      });
      expect(result.current.phase).toBe("filling");
      expect(result.current.activeStepId).toBe("b");
    });

    it("goNext skips steps with failing `when` predicate", async () => {
      const guardedFlow = [
        makeStep("a"),
        { ...makeStep("b"), when: () => false },
        makeStep("c"),
      ];

      const { result } = renderHook(() =>
        useFormState("guarded", guardedFlow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      expect(result.current.activeStepId).toBe("a");

      act(() => {
        result.current.goNext();
      });
      expect(result.current.activeStepId).toBe("c");
    });
  });

  describe("editing phase", () => {
    it("returns editingStepId as activeStepId when in editing phase", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });
      act(() => {
        result.current.send({ type: "GOTO_REVIEW" });
      });
      act(() => {
        result.current.send({ type: "EDIT_STEP", stepId: "b" });
      });

      expect(result.current.phase).toBe("editing");
      expect(result.current.activeStepId).toBe("b");
    });
  });

  describe("derived state", () => {
    it("returns activeStepId as null and currentStepIndex as 0 before START", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.activeStepId).toBeNull();
      expect(result.current.currentStepIndex).toBe(0);
    });

    it("computes visibleStepIds", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.steps).toHaveLength(2);
      expect(result.current.steps[0].id).toBe("a");
      expect(result.current.steps[1].id).toBe("b");
    });

    it("returns totalSteps matching visible step count", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.totalSteps).toBe(2);
    });

    it("returns currentStepIndex 0 on title", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.currentStepIndex).toBe(0);
    });

    it("returns 1-based currentStepIndex when filling", async () => {
      const { result } = renderHook(() =>
        useFormState("test-form", flow, getFormData),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.send({ type: "START" });
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.activeStepId).toBe("a");
    });
  });
});
