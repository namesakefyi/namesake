import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { createFormMachine, getPhase } from "@/forms/createFormMachine";
import { makeStep } from "./testHelpers";

describe("createFormMachine", () => {
  describe("linear flow", () => {
    const flow = [makeStep("a"), makeStep("b"), makeStep("c")];
    const machine = createFormMachine({ id: "test-linear", steps: flow });

    it("starts in title state", () => {
      const actor = createActor(machine);
      actor.start();
      expect(actor.getSnapshot().matches("title")).toBe(true);
      actor.stop();
    });

    it("START transitions to filling and sets currentStepId", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      expect(actor.getSnapshot().matches("filling")).toBe(true);
      expect(actor.getSnapshot().context.currentStepId).toBe("a");
      actor.stop();
    });

    it("GOTO_STEP navigates between steps", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_STEP", stepId: "b" });
      expect(actor.getSnapshot().context.currentStepId).toBe("b");
      actor.send({ type: "GOTO_STEP", stepId: "c" });
      expect(actor.getSnapshot().context.currentStepId).toBe("c");
      actor.stop();
    });

    it("GOTO_REVIEW transitions to review", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      expect(actor.getSnapshot().matches("review")).toBe(true);
      actor.stop();
    });

    it("GOTO_TITLE transitions back to title", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_TITLE" });
      expect(actor.getSnapshot().matches("title")).toBe(true);
      actor.stop();
    });
  });

  describe("review-edit flow", () => {
    const flow = [makeStep("a"), makeStep("b")];
    const machine = createFormMachine({ id: "test-review", steps: flow });

    it("EDIT_STEP from review transitions to editing with stepId in context", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "EDIT_STEP", stepId: "a" });
      expect(actor.getSnapshot().matches("editing")).toBe(true);
      expect(actor.getSnapshot().context.editingStepId).toBe("a");
      actor.stop();
    });

    it("SAVE_EDIT from editing returns to review and clears editingStepId", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "EDIT_STEP", stepId: "b" });
      actor.send({ type: "SAVE_EDIT" });
      expect(actor.getSnapshot().matches("review")).toBe(true);
      expect(actor.getSnapshot().context.editingStepId).toBeNull();
      actor.stop();
    });

    it("GOTO_STEP from review transitions to filling", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "GOTO_STEP", stepId: "b" });
      expect(actor.getSnapshot().matches("filling")).toBe(true);
      expect(actor.getSnapshot().context.currentStepId).toBe("b");
      actor.stop();
    });
  });

  describe("submission flow", () => {
    const flow = [makeStep("a")];
    const machine = createFormMachine({ id: "test-submit", steps: flow });

    it("SUBMIT from review transitions to submitting", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      expect(actor.getSnapshot().matches("submitting")).toBe(true);
      actor.stop();
    });

    it("SUBMIT_DONE transitions to complete", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      actor.send({ type: "SUBMIT_DONE" });
      expect(actor.getSnapshot().matches("complete")).toBe(true);
      actor.stop();
    });

    it("SUBMIT_ERROR returns to review", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      actor.send({ type: "SUBMIT_ERROR" });
      expect(actor.getSnapshot().matches("review")).toBe(true);
      actor.stop();
    });
  });
});

describe("getPhase", () => {
  it("returns the state name for simple string states", () => {
    expect(getPhase("title")).toBe("title");
    expect(getPhase("review")).toBe("review");
    expect(getPhase("filling")).toBe("filling");
    expect(getPhase("complete")).toBe("complete");
  });

  it("returns the top-level key for compound state objects", () => {
    expect(getPhase({ filling: "some-step" })).toBe("filling");
    expect(getPhase({ review: {} })).toBe("review");
  });

  it("defaults to 'title' for unexpected values", () => {
    expect(getPhase(null)).toBe("title");
    expect(getPhase(undefined)).toBe("title");
    expect(getPhase(42)).toBe("title");
  });
});
