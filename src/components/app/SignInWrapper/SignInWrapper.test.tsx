import { render, screen } from "@testing-library/react";
import { SignInWrapper } from "./SignInWrapper";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("SignInWrapper", () => {
  it("renders children correctly", () => {
    render(
      <SignInWrapper>
        <div data-testid="test-child">Test Content</div>
      </SignInWrapper>,
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className to Card component", () => {
    const customClass = "custom-class";
    render(
      <SignInWrapper className={customClass}>
        <div>Test Content</div>
      </SignInWrapper>,
    );

    const card = screen.getByText("Test Content").closest(".custom-class");
    expect(card).toBeInTheDocument();
  });

  it("renders all footer links with correct hrefs", () => {
    render(
      <SignInWrapper>
        <div>Test Content</div>
      </SignInWrapper>,
    );

    const versionLink = screen.getByText(/^v/);
    const supportLink = screen.getByText("Support");
    const statusLink = screen.getByText("Status");

    expect(versionLink).toHaveAttribute(
      "href",
      "https://github.com/namesakefyi/namesake/releases",
    );
    expect(supportLink).toHaveAttribute("href", "https://namesake.fyi/chat");
    expect(statusLink).toHaveAttribute("href", "https://status.namesake.fyi");
  });

  it("renders logo with correct link", () => {
    render(
      <SignInWrapper>
        <div>Test Content</div>
      </SignInWrapper>,
    );

    const logoLink = screen.getByRole("link", { name: "Namesake" });
    expect(logoLink).toHaveAttribute("href", "https://namesake.fyi");
  });
});
