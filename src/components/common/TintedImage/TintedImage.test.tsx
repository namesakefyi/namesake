import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TintedImage } from "./TintedImage";

describe("TintedImage", () => {
  const defaultProps = {
    src: "/test-image.png",
    alt: "Test image description",
  };

  it("renders with correct container styling", () => {
    const { container } = render(<TintedImage {...defaultProps} />);
    const containerDiv = container.firstChild as HTMLElement;

    expect(containerDiv).toHaveClass("relative");
    expect(containerDiv).toHaveClass("overflow-hidden");
    expect(containerDiv).toHaveClass("isolate");
    expect(containerDiv).toHaveClass("select-none");
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <TintedImage {...defaultProps} className="custom-class" />,
    );
    const containerDiv = container.firstChild as HTMLElement;

    expect(containerDiv).toHaveClass("custom-class");
  });

  it("renders exactly two image tags", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });

    expect(images).toHaveLength(2);
  });

  it("renders main image with correct attributes", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });
    const mainImage = images[0];

    expect(mainImage).toHaveAttribute("src", defaultProps.src);
    expect(mainImage).toHaveAttribute("alt", defaultProps.alt);
    expect(mainImage).toHaveClass("w-full");
    expect(mainImage).toHaveClass("select-none");
    expect(mainImage).toHaveClass("mix-blend-screen");
    expect(mainImage).toHaveClass("dark:mix-blend-multiply");
  });

  it("renders background image with correct positioning", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });
    const backgroundImage = images[1];

    expect(backgroundImage).toHaveClass("absolute");
    expect(backgroundImage).toHaveClass("inset-0");
    expect(backgroundImage).toHaveClass("-z-1");
  });

  it("hides background image from screen readers", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });
    const backgroundImage = images[1];

    expect(backgroundImage).toHaveAttribute("aria-hidden", "true");
  });

  it("has matching drop shadow offset and translate value", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });
    const backgroundImage = images[1];

    // The background image should have a drop shadow and translate with matching values
    // Drop shadow: 2000px x-offset, Translate: -2000px x-offset
    expect(backgroundImage).toHaveClass(
      "[filter:_drop-shadow(2000px_0px_0_var(--color-theme-12))]",
    );
    expect(backgroundImage).toHaveClass("-translate-x-[2000px]");
  });

  it("renders background image with same src and alt as main image", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });
    const mainImage = images[0];
    const backgroundImage = images[1];

    expect(backgroundImage).toHaveAttribute("src", defaultProps.src);
    expect(backgroundImage).toHaveAttribute("alt", defaultProps.alt);
    expect(mainImage.getAttribute("src")).toBe(
      backgroundImage.getAttribute("src"),
    );
    expect(mainImage.getAttribute("alt")).toBe(
      backgroundImage.getAttribute("alt"),
    );
  });

  it("has correct z-index stacking", () => {
    render(<TintedImage {...defaultProps} />);
    const images = screen.getAllByRole("img", { hidden: true });
    const mainImage = images[0];
    const backgroundImage = images[1];

    // Main image should not have z-index class (stays in normal flow)
    expect(mainImage).not.toHaveClass("-z-1");

    // Background image should have negative z-index
    expect(backgroundImage).toHaveClass("-z-1");
  });
});
