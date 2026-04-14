import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormFeedback } from "./FormFeedback";

const okResponse = () =>
  new Response(JSON.stringify({ success: true }), { status: 200 });

const errorResponse = () =>
  new Response(JSON.stringify({ error: "Server error" }), { status: 500 });

const getSubmitBody = () => {
  const [, options] = vi.mocked(fetch).mock.calls[0];
  return JSON.parse(options?.body as string);
};

describe("FormFeedback", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockResolvedValue(okResponse());
  });

  it("renders form fields", () => {
    render(<FormFeedback slug="court-order-ma" />);

    expect(
      screen.getByRole("radiogroup", { name: /form rating/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /easy/i })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /problems/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /feedback/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("allows selecting a sentiment option", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    const positive = screen.getByRole("radio", { name: /easy/i });
    const negative = screen.getByRole("radio", { name: /problems/i });

    await user.click(positive);
    expect(positive).toBeChecked();
    expect(negative).not.toBeChecked();

    await user.click(negative);
    expect(negative).toBeChecked();
    expect(positive).not.toBeChecked();
  });

  it("scrolls the success message into view after submission", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
      });
    });
  });

  it("shows a success message after submission", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /thank you for your feedback/i,
      );
    });
  });

  it("submits the correct form_slug and sentiment to the API", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(getSubmitBody()).toMatchObject({
        form_slug: "court-order-ma",
        sentiment: "positive",
      });
    });
  });

  it("includes the comment in the submission when provided", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    await user.type(
      screen.getByRole("textbox", { name: /feedback/i }),
      "Very helpful!",
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(getSubmitBody().comment).toBe("Very helpful!");
    });
  });

  it("omits the comment from the submission when left blank", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(getSubmitBody().comment).toBeUndefined();
    });
  });

  it("preserves field values after a submission error", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    await user.type(
      screen.getByRole("textbox", { name: /feedback/i }),
      "Great form!",
    );
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Server error" }), { status: 500 }),
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /easy/i })).toBeChecked();
      expect(screen.getByRole("textbox", { name: /feedback/i })).toHaveValue(
        "Great form!",
      );
    });
  });

  it("shows an error message when the API request fails", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /problems/i }));
    vi.mocked(fetch).mockResolvedValueOnce(errorResponse());
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /something went wrong/i,
      );
    });
  });

  it("shows a generic error when fetch throws a network error", async () => {
    const user = userEvent.setup();
    render(<FormFeedback slug="court-order-ma" />);

    await user.click(screen.getByRole("radio", { name: /easy/i }));
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /something went wrong/i,
      );
    });
  });

  describe("share button", () => {
    beforeEach(() => {
      vi.stubGlobal("navigator", {
        ...navigator,
        share: vi.fn().mockResolvedValue(undefined),
      });
    });

    it("calls navigator.share with the current page title and URL", async () => {
      const user = userEvent.setup();
      render(<FormFeedback slug="court-order-ma" />);

      await user.click(screen.getByRole("radio", { name: /easy/i }));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /share/i }),
        ).toBeInTheDocument(),
      );

      await user.click(screen.getByRole("button", { name: /share/i }));

      expect(navigator.share).toHaveBeenCalledWith({
        title: document.title,
        url: window.location.href,
      });
    });
  });
});
