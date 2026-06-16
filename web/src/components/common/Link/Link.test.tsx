import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Link } from "./Link";

describe("Link", () => {
  it("renders its children", () => {
    render(<Link href="/about">About us</Link>);
    expect(screen.getByText("About us")).toBeInTheDocument();
  });

  it("has role link", () => {
    render(<Link href="/about">About us</Link>);
    expect(screen.getByRole("link", { name: "About us" })).toBeInTheDocument();
  });

  it("sets the href attribute", () => {
    render(<Link href="/about">About us</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
  });

  it("sets the target attribute", () => {
    render(
      <Link href="https://example.com" target="_blank">
        External
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("is disabled when isDisabled is true", () => {
    render(
      <Link href="/about" isDisabled>
        About us
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not call onPress when disabled", async () => {
    const onPress = vi.fn();
    render(
      <Link href="/about" isDisabled onPress={onPress}>
        About us
      </Link>,
    );
    await userEvent.click(screen.getByRole("link"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
