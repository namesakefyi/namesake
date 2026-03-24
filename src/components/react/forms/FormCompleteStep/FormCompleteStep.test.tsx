import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FormCompleteStep,
  type FormCompleteStepProps,
} from "./FormCompleteStep";

vi.mock("@/db/database", () => ({
  clearFormProgress: vi.fn().mockResolvedValue(undefined),
  getAllFields: vi.fn().mockResolvedValue([]),
}));

vi.mock("../DeleteFormDataModal", () => ({
  DeleteFormDataModal: () => <div data-testid="delete-modal" />,
}));

vi.mock("../FormFeedback/FormFeedback", () => ({
  FormFeedback: () => <div data-testid="form-feedback" />,
}));

describe("FormCompleteStep", () => {
  const defaultProps: FormCompleteStepProps = {
    title: "Massachusetts Court Order",
    slug: "court-order-ma",
    onRedownload: vi.fn(),
  };

  describe("rendering", () => {
    it("renders the completion heading", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: "Form complete!" }),
      ).toBeInTheDocument();
    });

    it("renders the form title in the description", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(screen.getByText(/Massachusetts Court Order/)).toBeInTheDocument();
    });

    it("renders a redownload button", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /redownload/i }),
      ).toBeInTheDocument();
    });

    it("renders a restart button", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /restart/i }),
      ).toBeInTheDocument();
    });

    it("renders the delete data modal", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("renders the form feedback", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(screen.getByTestId("form-feedback")).toBeInTheDocument();
    });
  });

  describe("body color", () => {
    beforeEach(() => {
      document.body.dataset.color = "white";
    });

    afterEach(() => {
      delete document.body.dataset.color;
    });

    it("sets body data-color to green on mount", () => {
      render(<FormCompleteStep {...defaultProps} />);
      expect(document.body.dataset.color).toBe("green");
    });

    it("restores the previous body data-color on unmount", () => {
      const { unmount } = render(<FormCompleteStep {...defaultProps} />);
      unmount();
      expect(document.body.dataset.color).toBe("white");
    });
  });

  describe("redownload", () => {
    it("calls onRedownload when the redownload button is submitted", async () => {
      const user = userEvent.setup();
      const onRedownload = vi.fn();
      render(
        <FormCompleteStep {...defaultProps} onRedownload={onRedownload} />,
      );

      await user.click(screen.getByRole("button", { name: /redownload/i }));

      expect(onRedownload).toHaveBeenCalledOnce();
    });

    it("disables the redownload button while downloading", async () => {
      const user = userEvent.setup();
      let resolveDownload!: () => void;
      const onRedownload = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveDownload = resolve;
          }),
      );

      render(
        <FormCompleteStep {...defaultProps} onRedownload={onRedownload} />,
      );
      await user.click(screen.getByRole("button", { name: /redownload/i }));

      expect(
        screen.getByRole("button", { name: /redownload/i }),
      ).toBeDisabled();

      resolveDownload();
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /redownload/i }),
        ).not.toBeDisabled(),
      );
    });
  });

  describe("redownload error handling", () => {
    it("logs the error and re-enables the button if onRedownload throws", async () => {
      const user = userEvent.setup();
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Download failed");
      const onRedownload = vi.fn().mockRejectedValueOnce(error);

      render(
        <FormCompleteStep {...defaultProps} onRedownload={onRedownload} />,
      );
      await user.click(screen.getByRole("button", { name: /redownload/i }));

      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith("Re-download failed:", error);
        expect(
          screen.getByRole("button", { name: /redownload/i }),
        ).not.toBeDisabled();
      });

      errorSpy.mockRestore();
    });
  });

  describe("restart", () => {
    it("clears form progress and reloads the page", async () => {
      const user = userEvent.setup();
      const reloadSpy = vi.fn();
      vi.stubGlobal("location", { reload: reloadSpy });

      const { clearFormProgress } = await import("@/db/database");

      render(<FormCompleteStep {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: /restart/i }));

      await waitFor(() => {
        expect(clearFormProgress).toHaveBeenCalledWith("court-order-ma");
        expect(reloadSpy).toHaveBeenCalled();
      });
    });
  });
});
