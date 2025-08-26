import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";

describe("Skeleton", () => {
  it("should render base skeleton with correct attributes", () => {
    render(<Skeleton />);
    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton.className).toContain("animate-fade-in");
  });

  it("should apply custom className to base skeleton", () => {
    render(<Skeleton className="custom-class" />);
    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton.className).toContain("custom-class");
  });
});

describe("SkeletonCircle", () => {
  it("should render circle skeleton with correct attributes", () => {
    render(<SkeletonCircle />);
    const skeleton = screen.getByTestId("skeleton-circle");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton.className).toContain("rounded-full");
  });

  it("should apply custom className to circle skeleton", () => {
    render(<SkeletonCircle className="custom-class" />);
    const skeleton = screen.getByTestId("skeleton-circle");

    expect(skeleton.className).toContain("custom-class");
  });
});

describe("SkeletonText", () => {
  it("should render text skeleton with default props", () => {
    render(<SkeletonText />);
    const container = screen.getByTestId("skeleton-text");
    const skeletonLines = container.children;

    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-hidden", "true");
    expect(skeletonLines).toHaveLength(2); // default lines prop
    expect(container.className).toContain("items-start"); // default left alignment
  });

  it("should render specified number of lines", () => {
    render(<SkeletonText lines={4} />);
    const container = screen.getByTestId("skeleton-text");
    const skeletonLines = container.children;

    expect(skeletonLines).toHaveLength(4);
  });

  it("should apply correct alignment classes", () => {
    render(<SkeletonText align="center" />);
    const container = screen.getByTestId("skeleton-text");

    expect(container.className).toContain("items-center");
  });

  it("should generate random widths for each line", () => {
    render(<SkeletonText lines={3} />);
    const container = screen.getByTestId("skeleton-text");
    const skeletonLines = Array.from(container.children);

    const widths = skeletonLines.map((line) => line.getAttribute("style"));
    // Check that each line has a width between 70% and 90%
    for (const width of widths) {
      const percentage = Number.parseInt(width?.match(/\d+/)?.[0] ?? "0", 10);
      expect(percentage).toBeGreaterThanOrEqual(70);
      expect(percentage).toBeLessThanOrEqual(90);
    }
  });
});
