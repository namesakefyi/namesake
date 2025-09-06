import { useNavigate } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ZxcvbnResult } from "@zxcvbn-ts/core";
import { useMutation } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { authClient } from "@/main";
import { RegistrationForm } from "./RegistrationForm";

vi.mock("@/hooks/usePasswordStrength", () => ({
  usePasswordStrength: vi.fn(() => ({
    score: 4,
    feedback: { warning: "", suggestions: [] },
  })),
}));

describe("RegistrationForm", () => {
  const mockNavigate = vi.fn();
  const mockSignUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSignUp,
    );
    vi.mocked(authClient.signUp.email).mockImplementation(mockSignUp);
  });

  it("renders the registration form with all required fields", () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
  });

  it("allows entering registration details", async () => {
    render(<RegistrationForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const nameInput = screen.getByLabelText("Display Name");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "Test User");
    await user.type(passwordInput, "StrongPassword123!");

    expect(emailInput).toHaveValue("test@example.com");
    expect(nameInput).toHaveValue("Test User");
    expect(passwordInput).toHaveValue("StrongPassword123!");
  });

  it("handles successful registration", async () => {
    mockSignUp.mockImplementation((_credentials, callbacks) => {
      callbacks.onRequest();
      callbacks.onSuccess();
      return Promise.resolve({ error: null });
    });

    render(<RegistrationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Display Name"), "Test User");
    await user.type(screen.getByLabelText("Password"), "StrongPassword123!");
    await user.click(screen.getByRole("button", { name: "Register" }));

    // Wait for the navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });

    expect(mockSignUp).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "StrongPassword123!",
        name: "Test User",
      },
      {
        onRequest: expect.any(Function),
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });

  it("handles registration error", async () => {
    const mockError = { message: "Email already in use" };
    mockSignUp.mockImplementation((_credentials, callbacks) => {
      callbacks.onRequest();
      callbacks.onError({ error: mockError });
      return Promise.resolve({ error: mockError });
    });

    render(<RegistrationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "existing@example.com");
    await user.type(screen.getByLabelText("Display Name"), "Test User");
    await user.type(screen.getByLabelText("Password"), "StrongPassword123!");
    await user.click(screen.getByRole("button", { name: "Register" }));

    const errorMessage = await screen.findByText("Email already in use");
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows fallback error message when error has no message property", async () => {
    const mockError = {};
    mockSignUp.mockImplementation((_credentials, callbacks) => {
      callbacks.onRequest();
      callbacks.onError({ error: mockError });
      return Promise.resolve({ error: mockError });
    });

    render(<RegistrationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Display Name"), "Test User");
    await user.type(screen.getByLabelText("Password"), "StrongPassword123!");
    await user.click(screen.getByRole("button", { name: "Register" }));

    const errorMessage = await screen.findByText(
      "Couldn't sign in. Check your information and try again.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("prevents registration with weak passwords", async () => {
    // Mock weak password strength
    vi.mocked(usePasswordStrength).mockReturnValue({
      score: 2,
      feedback: { warning: "Add more special characters", suggestions: [] },
    } as unknown as ZxcvbnResult);

    render(<RegistrationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Display Name"), "Test User");
    await user.type(screen.getByLabelText("Password"), "weak");
    await user.click(screen.getByRole("button", { name: "Register" }));

    // Verify error message is shown
    const errorMessage = await screen.findByText(
      /Please choose a stronger password/,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Add more special characters");

    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("disables form inputs while submitting", async () => {
    // Mock strong password
    vi.mocked(usePasswordStrength).mockReturnValue({
      score: 4,
      feedback: { warning: "", suggestions: [] },
    } as unknown as ZxcvbnResult);

    mockSignUp.mockImplementation((_credentials, callbacks) => {
      callbacks.onRequest();
      return new Promise((resolve) =>
        setTimeout(() => {
          callbacks.onSuccess();
          resolve({ error: null });
        }, 100),
      );
    });

    render(<RegistrationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Display Name"), "Test User");
    await user.type(
      screen.getByLabelText("Password"),
      "correct horse battery staple",
    );

    const submitButton = screen.getByRole("button", {
      name: "Register",
    });
    await user.click(submitButton);

    expect(mockSignUp).toHaveBeenCalled();

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect(input).toBeDisabled();
    }
    expect(submitButton).toBeDisabled();
  });
});
