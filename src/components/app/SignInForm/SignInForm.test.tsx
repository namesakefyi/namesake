import { useNavigate } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { authClient } from "@/main";
import { SignInForm } from "./SignInForm";

describe("SignInForm", () => {
  it("renders the sign in form with all required fields", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Forgot?")).toBeInTheDocument();
  });

  it("allows entering email and password", async () => {
    render(<SignInForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("handles successful sign in", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const mockSignIn = vi.fn().mockImplementation((_credentials, callbacks) => {
      callbacks.onRequest();
      callbacks.onSuccess();
      return Promise.resolve({ error: null });
    });
    vi.mocked(authClient.signIn.email).mockImplementation(mockSignIn);

    render(<SignInForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    // Wait for the navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });

    expect(mockSignIn).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "password123",
      },
      {
        onRequest: expect.any(Function),
        onSuccess: expect.any(Function),
      },
    );
  });

  it("handles sign in error", async () => {
    const mockError = { message: "Invalid credentials" };
    const mockSignIn = vi.fn().mockResolvedValue({ error: mockError });
    vi.mocked(authClient.signIn.email).mockImplementation(mockSignIn);

    render(<SignInForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();
  });

  it("disables form inputs while submitting", async () => {
    const mockSignIn = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: null }), 100),
          ),
      );
    vi.mocked(authClient.signIn.email).mockImplementation(mockSignIn);

    render(<SignInForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
