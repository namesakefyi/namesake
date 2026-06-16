import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Banner } from "./Banner";

describe("Banner", () => {
  describe("children", () => {
    it("renders its children", () => {
      render(<Banner>Something went wrong.</Banner>);
      expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    });
  });

  describe("default variant", () => {
    it("defaults to the info variant", () => {
      render(<Banner>Message</Banner>);
      expect(screen.getByRole("status")).toHaveAttribute(
        "data-variant",
        "info",
      );
    });
  });

  describe("role", () => {
    it("uses role status for info variant", () => {
      render(<Banner variant="info">Message</Banner>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("uses role status for success variant", () => {
      render(<Banner variant="success">Message</Banner>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("uses role alert for warning variant", () => {
      render(<Banner variant="warning">Message</Banner>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("uses role alert for error variant", () => {
      render(<Banner variant="error">Message</Banner>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("data-variant attribute", () => {
    it.each([
      "info",
      "success",
      "warning",
      "error",
    ] as const)("sets data-variant to %s", (variant) => {
      render(<Banner variant={variant}>Message</Banner>);
      expect(
        screen.getByRole(
          variant === "error" || variant === "warning" ? "alert" : "status",
        ),
      ).toHaveAttribute("data-variant", variant);
    });
  });

  describe("icon", () => {
    it("renders an icon element", () => {
      render(<Banner>Message</Banner>);
      expect(document.querySelector(".banner-icon svg")).toBeInTheDocument();
    });

    it("renders a custom icon when provided", () => {
      const CustomIcon = () => <svg data-testid="custom-icon" />;
      render(<Banner icon={CustomIcon}>Message</Banner>);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("additional HTML attributes", () => {
    it("forwards extra props to the root element", () => {
      render(
        <Banner data-testid="my-banner" className="extra">
          Message
        </Banner>,
      );
      const banner = screen.getByTestId("my-banner");
      expect(banner).toHaveClass("banner", "extra");
    });
  });
});
