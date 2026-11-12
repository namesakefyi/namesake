import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Step } from "#constants/forms";
import * as db from "#db/database";
import { q } from "#lib/forms/questions";
import { FormContainer, type FormContainerProps } from "./FormContainer";

vi.mock("#db/database", () => ({
  getFormProgress: vi.fn().mockResolvedValue(undefined),
  saveFormProgress: vi.fn().mockResolvedValue(undefined),
  clearFormProgress: vi.fn().mockResolvedValue(undefined),
  getAllFields: vi.fn().mockResolvedValue([]),
  getFieldsByNames: vi.fn().mockResolvedValue([]),
  saveField: vi.fn().mockResolvedValue(undefined),
  deleteField: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("#lib/forms/loadForm");

import { loadFormDownload, loadFormSteps } from "#lib/forms/loadForm";

/** Waits until the form and its saved progress have loaded. */
async function waitForLoad() {
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled(),
  );
}

async function start(user: ReturnType<typeof userEvent.setup>) {
  await waitForLoad();
  await user.click(screen.getByRole("button", { name: "Start" }));
}

const plainStep: Step = {
  id: "plain",
  title: "Plain Step",
  questions: [q.banner("Step content")],
};

const formStepStep: Step = {
  id: "form-step",
  title: "Form Step",
  questions: [],
};

const testForm: FormContainerProps["form"] = {
  id: "ma/court-order",
  title: "Test",
  stepCount: 1,
  pdfs: [],
};

describe("FormContainer", () => {
  beforeEach(() => {
    vi.mocked(db.getFormProgress).mockResolvedValue(undefined);
    vi.mocked(loadFormSteps).mockResolvedValue([plainStep]);
    vi.mocked(loadFormDownload).mockResolvedValue({
      title: "Test",
      instructions: [],
      pdfs: [],
    });
  });

  beforeAll(() => {
    if (typeof globalThis.indexedDB === "undefined") {
      Object.defineProperty(globalThis, "indexedDB", { value: {} });
    }
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  describe("title step", () => {
    it("renders title on title step", async () => {
      render(<FormContainer form={testForm} />);
      await waitForLoad();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("renders description on title step", async () => {
      render(
        <FormContainer
          form={{ ...testForm, description: "Test Description" }}
        />,
      );
      await waitForLoad();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("renders start button on title step", async () => {
      render(<FormContainer form={testForm} />);
      await waitForLoad();
    });

    it("renders PDF metadata provided by the Astro wrapper", async () => {
      render(
        <FormContainer
          form={{
            ...testForm,
            pdfs: [
              {
                title: "Petition to Change Name of Adult",
                code: "CJP-27",
                file: "/forms/cjp27-petition-to-change-name-of-adult.pdf",
              },
            ],
          }}
        />,
      );

      await waitForLoad();
      expect(
        screen.getByText("Petition to Change Name of Adult (CJP-27)"),
      ).toBeInTheDocument();
    });

    it("shows the title step with Start disabled while the form loads", async () => {
      vi.mocked(loadFormSteps).mockReturnValue(new Promise(() => {}));

      render(<FormContainer form={testForm} />);
      await act(async () => {});

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeDisabled();
    });

    it("keeps Start disabled while saved progress is being fetched", async () => {
      vi.mocked(db.getFormProgress).mockReturnValue(new Promise(() => {}));

      render(<FormContainer form={testForm} />);
      await act(async () => {});

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeDisabled();
    });
  });

  describe("filling phase", () => {
    it("renders step content and navigation after clicking Start", async () => {
      const user = userEvent.setup();
      render(<FormContainer form={testForm} />);

      await start(user);

      expect(screen.getByText("Step content")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("returns to title after clicking Previous step", async () => {
      const user = userEvent.setup();
      render(<FormContainer form={testForm} />);

      await start(user);
      await user.click(screen.getByRole("button", { name: "Previous step" }));

      expect(
        await screen.findByRole("button", { name: "Start" }),
      ).toBeInTheDocument();
    });
  });

  describe("review phase", () => {
    it("renders review step after clicking Next step", async () => {
      const user = userEvent.setup();
      render(<FormContainer form={testForm} />);

      await start(user);
      await user.click(screen.getByRole("button", { name: "Next step" }));

      expect(
        await screen.findByText("Review your information"),
      ).toBeInTheDocument();
    });
  });

  describe("handleFormSubmit — default case (filling)", () => {
    it("advances to review when a filling-phase form step is submitted", async () => {
      vi.mocked(loadFormSteps).mockResolvedValue([formStepStep]);
      const user = userEvent.setup();
      render(<FormContainer form={testForm} />);

      await start(user);
      await user.click(screen.getByRole("button", { name: "Continue" }));

      expect(
        await screen.findByText("Review your information"),
      ).toBeInTheDocument();
    });
  });

  it("starts the next step's questions fresh", async () => {
    vi.mocked(loadFormSteps).mockResolvedValue([
      {
        id: "residence",
        title: "Where do you live?",
        questions: [q.address("residence", { address2: true })],
      },
      {
        id: "mailing",
        title: "Where do you get mail?",
        questions: [q.address("mailing", { address2: true })],
      },
    ]);
    render(<FormContainer form={testForm} />);
    await start(userEvent.setup());
    await userEvent.click(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByRole("heading", { name: "Where do you get mail?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    ).toBeInTheDocument();
  });

  it("loads the form's downloads once the person starts filling", async () => {
    const user = userEvent.setup();
    render(<FormContainer form={testForm} />);

    await waitForLoad();
    expect(loadFormDownload).not.toHaveBeenCalled();

    await start(user);
    expect(loadFormDownload).toHaveBeenCalledWith("ma/court-order");
  });
});
