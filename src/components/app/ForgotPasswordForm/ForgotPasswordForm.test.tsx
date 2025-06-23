import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authClient } from "@/main";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  const mockForgetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.forgetPassword).mockImplementation(mockForgetPassword);
    mockForgetPassword.mockImplementation(({ fetchOptions }) => {
      if (fetchOptions?.onSuccess) {
        fetchOptions.onSuccess();
      }
      return Promise.resolve({ error: null });
    });

    // Mock fetch for sniper response
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            url: "https://gmail.com",
            image: "gmail-logo.png",
            provider_pretty: "Gmail",
          }),
      }),
    );
  });

  it("renders the forgot password form with required fields", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send reset email" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot password")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to sign-in" }),
    ).toBeInTheDocument();
  });

  it("handles successful password reset request", async () => {
    render(<ForgotPasswordForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset email" }));

    expect(mockForgetPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      redirectTo: "/reset-password",
      fetchOptions: {
        onSuccess: expect.any(Function),
      },
    });

    // Check success message
    expect(
      screen.getByText(
        "Sent! Check your email for a link to reset your password.",
      ),
    ).toBeInTheDocument();

    // Check sniper link
    expect(screen.getByText("Open Gmail")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Gmail" })).toHaveAttribute(
      "href",
      "https://gmail.com",
    );
  });

  it("handles password reset request error", async () => {
    const mockError = {
      status: 400,
      statusText: "Invalid email",
      message: "Invalid email",
    };

    mockForgetPassword.mockImplementation(() => {
      return Promise.resolve({ error: mockError });
    });

    render(<ForgotPasswordForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "invalid@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset email" }));

    const errorMessage = await screen.findByText("Invalid email");
    expect(errorMessage).toBeInTheDocument();
  });

  it("disables form inputs while submitting", async () => {
    mockForgetPassword.mockImplementation(({ fetchOptions }) => {
      return new Promise((resolve) =>
        setTimeout(() => {
          if (fetchOptions?.onSuccess) {
            fetchOptions.onSuccess();
          }
          resolve({ error: null });
        }, 100),
      );
    });

    render(<ForgotPasswordForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("handles sniper API error gracefully", async () => {
    // Mock fetch to fail
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    render(<ForgotPasswordForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset email" }));

    // Should still show success message even if sniper fails
    expect(
      screen.getByText(
        "Sent! Check your email for a link to reset your password.",
      ),
    ).toBeInTheDocument();

    // Should not show sniper link
    expect(
      screen.queryByRole("link", { name: /Open/ }),
    ).not.toBeInTheDocument();
  });
});
