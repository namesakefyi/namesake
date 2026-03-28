import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders its label", () => {
      render(<Button>Save</Button>);
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("defaults to secondary variant and medium size", () => {
      render(<Button>Save</Button>);
      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("data-variant", "secondary");
      expect(btn).toHaveAttribute("data-size", "medium");
    });

    it("applies the primary variant via data-variant", () => {
      render(<Button variant="primary">Continue</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "data-variant",
        "primary",
      );
    });

    it("applies the large size via data-size", () => {
      render(<Button size="large">Continue</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "large");
    });

    it("renders a start icon", () => {
      const { container } = render(
        <Button icon={RiArrowLeftLine}>Back</Button>,
      );
      expect(
        container.querySelector(".react-aria-Button-start-icon"),
      ).toBeInTheDocument();
    });

    it("renders an end icon", () => {
      const { container } = render(
        <Button endIcon={RiArrowRightLine}>Next</Button>,
      );
      expect(
        container.querySelector(".react-aria-Button-end-icon"),
      ).toBeInTheDocument();
    });
  });

  describe("pending state", () => {
    it("renders the progress indicator when isPending is true", () => {
      render(
        <Button icon={RiArrowLeftLine} isPending>
          Saving
        </Button>,
      );
      expect(
        screen.getByRole("progressbar", { name: "Saving..." }),
      ).toBeInTheDocument();
    });

    it("hides the start icon when isPending is true", () => {
      const { container } = render(
        <Button icon={RiArrowLeftLine} isPending>
          Saving
        </Button>,
      );
      expect(
        container.querySelector(".react-aria-Button-start-icon"),
      ).not.toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("calls onPress when clicked", async () => {
      const onPress = vi.fn();
      render(<Button onPress={onPress}>Save</Button>);
      await userEvent.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledOnce();
    });

    it("is disabled when isDisabled is true", () => {
      render(<Button isDisabled>Save</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not call onPress when disabled", async () => {
      const onPress = vi.fn();
      render(
        <Button isDisabled onPress={onPress}>
          Save
        </Button>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });
  });
});
