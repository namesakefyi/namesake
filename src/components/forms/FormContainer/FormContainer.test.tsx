import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig, FormSlug } from "../../../constants/forms";
import * as db from "../../../db/database";
import type { Step } from "../../../forms/types";
import { FormStep } from "../FormStep/FormStep";
import { FormContainer } from "./FormContainer";

vi.mock("../../../db/database", () => ({
  getFormProgress: vi.fn().mockResolvedValue(undefined),
  saveFormProgress: vi.fn().mockResolvedValue(undefined),
  clearFormProgress: vi.fn().mockResolvedValue(undefined),
  getAllFields: vi.fn().mockResolvedValue([]),
  getFieldsByNames: vi.fn().mockResolvedValue([]),
  saveField: vi.fn().mockResolvedValue(undefined),
  deleteField: vi.fn().mockResolvedValue(undefined),
}));

const plainStep: Step = {
  id: "plain",
  title: "Plain Step",
  fields: [],
  component: () => <div>Step content</div>,
};

const formStepStep: Step = {
  id: "form-step",
  title: "Form Step",
  fields: [],
  component: ({ stepConfig }) => <FormStep stepConfig={stepConfig} />,
};

const plainConfig: FormConfig = {
  slug: "court-order-ma",
  steps: [plainStep],
  pdfs: [],
  downloadTitle: "Test",
  instructions: [],
};

const formStepConfig: FormConfig = {
  slug: "court-order-ma",
  steps: [formStepStep],
  pdfs: [],
  downloadTitle: "Test",
  instructions: [],
};

vi.mock("../../../constants/forms", async (importOriginal) => {
  const orig = (await importOriginal()) as Record<string, unknown>;
  return {
    ...orig,
    getFormConfig: vi.fn(),
  };
});

import { getFormConfig } from "../../../constants/forms";

describe("FormContainer", () => {
  beforeEach(() => {
    vi.mocked(db.getFormProgress).mockResolvedValue(undefined);
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
    beforeEach(() => {
      vi.mocked(getFormConfig).mockReturnValue(plainConfig);
    });

    it("renders title on title step", async () => {
      render(<FormContainer slug="court-order-ma" title="Test Title" />);
      expect(await screen.findByText("Test Title")).toBeInTheDocument();
    });

    it("renders description on title step", async () => {
      render(
        <FormContainer
          slug="court-order-ma"
          title="Test Title"
          description="Test Description"
        />,
      );
      expect(await screen.findByText("Test Description")).toBeInTheDocument();
    });

    it("renders start button on title step", async () => {
      render(<FormContainer slug="court-order-ma" title="Test Title" />);
      expect(
        await screen.findByRole("button", { name: "Start" }),
      ).toBeInTheDocument();
    });

    it("renders a loading spinner while saved progress is being fetched", async () => {
      vi.mocked(db.getFormProgress).mockReturnValue(new Promise(() => {}));

      render(<FormContainer slug="court-order-ma" title="Test Title" />);
      await act(async () => {});

      expect(
        screen.getByRole("progressbar", { name: "Loading form" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    });
  });

  describe("filling phase", () => {
    beforeEach(() => {
      vi.mocked(getFormConfig).mockReturnValue(plainConfig);
    });

    it("renders step content and navigation after clicking Start", async () => {
      const user = userEvent.setup();
      render(<FormContainer slug="court-order-ma" title="Test Title" />);

      await user.click(await screen.findByRole("button", { name: "Start" }));

      expect(screen.getByText("Step content")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("returns to title after clicking Previous step", async () => {
      const user = userEvent.setup();
      render(<FormContainer slug="court-order-ma" title="Test Title" />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Previous step" }));

      expect(
        await screen.findByRole("button", { name: "Start" }),
      ).toBeInTheDocument();
    });
  });

  describe("review phase", () => {
    beforeEach(() => {
      vi.mocked(getFormConfig).mockReturnValue(plainConfig);
    });

    it("renders review step after clicking Next step", async () => {
      const user = userEvent.setup();
      render(<FormContainer slug="court-order-ma" title="Test Title" />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Next step" }));

      expect(
        await screen.findByText("Review your information"),
      ).toBeInTheDocument();
    });
  });

  describe("handleFormSubmit — default case (filling)", () => {
    beforeEach(() => {
      vi.mocked(getFormConfig).mockReturnValue(formStepConfig);
    });

    it("advances to review when a filling-phase form step is submitted", async () => {
      const user = userEvent.setup();
      render(
        <FormContainer
          slug={"test-form-step" as FormSlug}
          title="Test Title"
        />,
      );

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Continue" }));

      expect(
        await screen.findByText("Review your information"),
      ).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("throws when slug has no registered config", () => {
      vi.mocked(getFormConfig).mockReturnValue(undefined);

      expect(() =>
        render(<FormContainer slug={"nonexistent" as FormSlug} title="Test" />),
      ).toThrow(/No form registered for slug/);
    });
  });
});
