import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  describe("rendering", () => {
    it("renders a progressbar element", () => {
      render(<ProgressBar label="Uploading" value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders the label when provided", () => {
      render(<ProgressBar label="Uploading" value={50} />);
      expect(screen.getByText("Uploading")).toBeInTheDocument();
    });

    it("renders without a label element when label is omitted", () => {
      render(<ProgressBar aria-label="Uploading" value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.queryByRole("label")).not.toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("sets aria-valuenow to the current value", () => {
      render(<ProgressBar label="Step progress" value={3} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "3",
      );
    });

    it("defaults aria-valuemin to 0 and aria-valuemax to 100", () => {
      render(<ProgressBar label="Step progress" value={40} />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });

    it("reflects custom minValue and maxValue", () => {
      render(<ProgressBar label="Steps" value={2} minValue={0} maxValue={5} />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "5");
      expect(bar).toHaveAttribute("aria-valuenow", "2");
    });
  });

  describe("fill bar transform", () => {
    it("translates the fill by (percentage - 100)% for a determinate value", () => {
      // value=75 on a 0–100 scale → 75% → translateX(-25%)
      render(<ProgressBar label="Step progress" value={75} />);
      const fill = document.querySelector(".fill") as HTMLElement;
      expect(fill.style.transform).toBe("translateX(-25%)");
    });

    it("translates to translateX(0%) at 100%", () => {
      render(<ProgressBar label="Step progress" value={100} />);
      const fill = document.querySelector(".fill") as HTMLElement;
      expect(fill.style.transform).toBe("translateX(0%)");
    });

    it("translates to translateX(-100%) at 0%", () => {
      render(<ProgressBar label="Step progress" value={0} />);
      const fill = document.querySelector(".fill") as HTMLElement;
      expect(fill.style.transform).toBe("translateX(-100%)");
    });

    it("uses translateX(-60%) for an indeterminate bar", () => {
      render(<ProgressBar aria-label="Loading" isIndeterminate />);
      const fill = document.querySelector(".fill") as HTMLElement;
      expect(fill.style.transform).toBe("translateX(-60%)");
    });

    it("computes the transform correctly for a custom maxValue", () => {
      // value=2 on a 0–5 scale → 40% → translateX(-60%)
      render(<ProgressBar label="Steps" value={2} minValue={0} maxValue={5} />);
      const fill = document.querySelector(".fill") as HTMLElement;
      expect(fill.style.transform).toBe("translateX(-60%)");
    });
  });

  describe("value text", () => {
    it("displays the default percentage value text", () => {
      render(<ProgressBar label="Step progress" value={50} />);
      expect(document.querySelector(".value")).toHaveTextContent("50%");
    });

    it("displays a custom valueLabel when provided", () => {
      render(
        <ProgressBar
          label="Step progress"
          value={3}
          maxValue={5}
          valueLabel="Step 3 of 5"
        />,
      );
      expect(document.querySelector(".value")).toHaveTextContent("Step 3 of 5");
    });
  });
});
