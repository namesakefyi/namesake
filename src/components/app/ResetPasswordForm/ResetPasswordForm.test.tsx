import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ZxcvbnResult } from "@zxcvbn-ts/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { authClient, router } from "@/main";
import { ResetPasswordForm } from "./ResetPasswordForm";

vi.mock("@/hooks/usePasswordStrength", () => ({
  usePasswordStrength: vi.fn(() => ({
    score: 4,
    feedback: { warning: "", suggestions: [] },
  })),
}));

describe("ResetPasswordForm", () => {
  const mockToken = "valid-reset-token";
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock router.navigate
    vi.mocked(router.navigate).mockImplementation(() => {});

    // Mock authClient.resetPassword
    vi.mocked(authClient.resetPassword).mockImplementation(mockResetPassword);
    mockResetPassword.mockImplementation(({ fetchOptions }) => {
      if (fetchOptions?.onSuccess) {
        fetchOptions.onSuccess({
          response: new Response(),
          data: null,
          request: new Request("http://example.com"),
        });
      }
      return Promise.resolve({ error: null });
    });

    // Mock URL search params
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("token", mockToken);
    Object.defineProperty(window, "location", {
      value: {
        search: `?${mockSearchParams.toString()}`,
      },
      writable: true,
    });
  });

  it("renders the reset password form with required fields", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset password" }),
    ).toBeInTheDocument();
  });

  it("shows error when no token is present", () => {
    // Mock empty search params
    Object.defineProperty(window, "location", {
      value: {
        search: "",
      },
      writable: true,
    });

    render(<ResetPasswordForm />);

    expect(
      screen.getByText(
        "Reset password link expired. Please request a new one.",
      ),
    ).toBeInTheDocument();
  });

  it("allows entering new password", async () => {
    render(<ResetPasswordForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText("New password");
    await user.type(passwordInput, "StrongPassword123!");

    expect(passwordInput).toHaveValue("StrongPassword123!");
  });

  it("handles successful password reset", async () => {
    render(<ResetPasswordForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText("New password"),
      "StrongPassword123!",
    );
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    expect(mockResetPassword).toHaveBeenCalledWith({
      newPassword: "StrongPassword123!",
      token: mockToken,
      fetchOptions: {
        onSuccess: expect.any(Function),
      },
    });

    await vi.waitFor(() => {
      expect(router.navigate).toHaveBeenCalledWith({ to: "/signin" });
    });
  });

  it("handles reset password error", async () => {
    const mockError = {
      status: 400,
      statusText: "Bad Request",
      error: "Invalid token",
      name: "BetterFetchError",
      message: "Invalid token",
    };

    mockResetPassword.mockImplementation(({ fetchOptions }) => {
      if (fetchOptions?.onSuccess) {
        fetchOptions.onSuccess({
          error: mockError,
          response: new Response(null, { status: 400 }),
          request: new Request("http://example.com"),
        });
      }
      return Promise.resolve({ error: mockError });
    });

    render(<ResetPasswordForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText("New password"),
      "StrongPassword123!",
    );
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    const errorMessage = await screen.findByText("Invalid token");
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows fallback error message when error has no message property", async () => {
    const mockError = {
      status: 500,
      statusText: "Internal Server Error",
      error: "Unknown error",
      name: "BetterFetchError",
    };

    mockResetPassword.mockImplementation(({ fetchOptions }) => {
      if (fetchOptions?.onSuccess) {
        fetchOptions.onSuccess({
          error: mockError,
          response: new Response(null, { status: 500 }),
          request: new Request("http://example.com"),
        });
      }
      return Promise.resolve({ error: mockError });
    });

    render(<ResetPasswordForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText("New password"),
      "StrongPassword123!",
    );
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    const errorMessage = await screen.findByText(
      "Something went wrong. Please try again.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("prevents reset with weak passwords", async () => {
    // Mock weak password strength
    vi.mocked(usePasswordStrength).mockReturnValue({
      score: 2,
      feedback: { warning: "Add more special characters", suggestions: [] },
    } as unknown as ZxcvbnResult);

    render(<ResetPasswordForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("New password"), "weak");
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    const errorMessage = await screen.findByText(
      /Please choose a stronger password/,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Add more special characters");

    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("disables form inputs while submitting", async () => {
    // Ensure password strength check passes
    vi.mocked(usePasswordStrength).mockReturnValue({
      score: 4,
      feedback: { warning: "", suggestions: [] },
    } as unknown as ZxcvbnResult);

    mockResetPassword.mockImplementation(({ fetchOptions }) => {
      return new Promise((resolve) =>
        setTimeout(() => {
          if (fetchOptions?.onSuccess) {
            fetchOptions.onSuccess({
              response: new Response(),
              data: null,
              request: new Request("http://example.com"),
            });
          }
          resolve({ error: null });
        }, 100),
      );
    });

    render(<ResetPasswordForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText("New password"),
      "StrongPassword123!",
    );
    const submitButton = screen.getByRole("button", { name: "Reset password" });
    await user.click(submitButton);

    expect(mockResetPassword).toHaveBeenCalledWith({
      newPassword: "StrongPassword123!",
      token: mockToken,
      fetchOptions: {
        onSuccess: expect.any(Function),
      },
    });
    expect(screen.getByLabelText("New password")).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
