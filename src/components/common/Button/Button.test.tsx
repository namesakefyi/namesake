import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowRight, User } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with text content", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("renders with the provided variant", () => {
    render(<Button variant="primary">Primary Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-purple-9");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12");
  });

  it("renders with an icon", () => {
    render(<Button icon={User}>User Button</Button>);

    const button = screen.getByRole("button", { name: "User Button" });
    const icon = button.querySelector("svg");

    expect(icon).toBeInTheDocument();
    expect(button).toHaveTextContent("User Button");
  });

  it("renders with an end icon", () => {
    render(<Button endIcon={ArrowRight}>Continue</Button>);

    const button = screen.getByRole("button", { name: "Continue" });
    const icon = button.querySelector("svg");

    expect(icon).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onPress={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button isDisabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-40");
  });

  it("doesn't trigger click events when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onPress={handleClick} isDisabled>
        Disabled Button
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  describe("when in submitting state", () => {
    it("shows a loading spinner", () => {
      render(<Button isSubmitting>Submit</Button>);

      const spinner = screen
        .getByRole("button")
        .querySelector("svg.animate-spin");
      expect(spinner).toBeInTheDocument();

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Loading",
      );
    });

    it("is disabled when submitting", () => {
      render(<Button isSubmitting>Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("contains the text in the DOM but visually shows only the spinner", () => {
      render(<Button isSubmitting>Submit</Button>);

      const textElement = screen.getByText("Submit");
      expect(textElement).toBeInTheDocument();
      // Text should be visually hidden
      expect(textElement.closest("span")).toHaveClass("invisible");

      // Spinner should be visible
      expect(
        screen.getByRole("button").querySelector("svg.animate-spin"),
      ).toBeInTheDocument();
    });

    it("overlays spinner over icon when isSubmitting is true", () => {
      // First render with icon but not submitting
      const { rerender } = render(<Button icon={User}>Submit</Button>);

      // Should show the user icon
      let icons = screen.getByRole("button").querySelectorAll("svg");
      expect(icons.length).toBe(1);
      expect(icons[0]).toHaveClass("shrink-0");

      // Now rerender with isSubmitting=true
      rerender(
        <Button icon={User} isSubmitting>
          Submit
        </Button>,
      );

      // Should show both the user icon (hidden) and the loader
      icons = screen.getByRole("button").querySelectorAll("svg");
      expect(icons.length).toBe(2);

      // First icon should be the User icon (now hidden)
      expect(icons[0].closest("span")).toHaveClass("invisible");

      // Second icon should be the spinner
      expect(icons[1]).toHaveClass("animate-spin");
    });

    it("doesn't trigger click events when submitting", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onPress={handleClick} isSubmitting>
          Submitting
        </Button>,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
