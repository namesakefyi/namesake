import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Slider } from "./Slider";

describe("Slider", () => {
  describe("rendering", () => {
    it("renders the label when provided", () => {
      render(<Slider label="Volume" defaultValue={50} />);
      expect(screen.getByText("Volume")).toBeInTheDocument();
    });

    it("renders without a label when not provided", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );
      expect(container.querySelector("label")).toBeNull();
    });

    it("renders a slider thumb", () => {
      render(<Slider label="Volume" defaultValue={50} />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("displays the current value in the output", () => {
      render(<Slider label="Volume" defaultValue={50} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("reflects minValue, maxValue, and defaultValue", () => {
      render(
        <Slider
          label="Progress"
          defaultValue={25}
          minValue={0}
          maxValue={100}
        />,
      );
      // The thumb renders as <input type="range">, which uses native HTML
      // min/max/value attributes rather than aria-value* counterparts.
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "100");
      expect(slider).toHaveAttribute("value", "25");
    });

    it("applies thumbLabels as aria-label on each thumb", () => {
      render(
        <Slider
          label="Price range"
          defaultValue={[20, 80]}
          thumbLabels={["Min price", "Max price"]}
        />,
      );
      const thumbs = screen.getAllByRole("slider");
      expect(thumbs[0]).toHaveAttribute("aria-label", "Min price");
      expect(thumbs[1]).toHaveAttribute("aria-label", "Max price");
    });
  });

  describe("range slider", () => {
    it("renders two thumbs for a range value", () => {
      render(<Slider label="Price range" defaultValue={[20, 80]} />);
      expect(screen.getAllByRole("slider")).toHaveLength(2);
    });

    it("displays the range in the output separated by an em-dash", () => {
      render(<Slider label="Price range" defaultValue={[20, 80]} />);
      expect(screen.getByText("20 – 80")).toBeInTheDocument();
    });
  });
});
