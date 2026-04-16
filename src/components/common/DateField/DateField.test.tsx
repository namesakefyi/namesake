import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateField } from "./DateField";

describe("DateField", () => {
  describe("rendering", () => {
    it("renders a labelled date group", () => {
      render(<DateField label="Date of birth" />);
      expect(
        screen.getByRole("group", { name: "Date of birth" }),
      ).toBeInTheDocument();
    });

    it("renders without a label element when label is not provided", () => {
      const { container } = render(<DateField aria-label="Date of birth" />);
      expect(container.querySelector("label")).toBeNull();
    });

    it("renders three spinbutton segments (month, day, year)", () => {
      render(<DateField label="Date of birth" />);
      expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
    });

    it("renders description text when provided", () => {
      render(
        <DateField
          label="Date of birth"
          description="Enter your date of birth"
        />,
      );
      // React Aria duplicates description text in a hidden SSR template
      expect(
        screen.getAllByText("Enter your date of birth").length,
      ).toBeGreaterThan(0);
    });

    it("renders an error message when isInvalid is true", () => {
      render(
        <DateField
          label="Date of birth"
          errorMessage="Please enter a valid date"
          isInvalid
        />,
      );
      expect(screen.getByText("Please enter a valid date")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("marks the group as disabled", () => {
      render(<DateField label="Date of birth" isDisabled />);
      // React Aria sets aria-disabled on the group element
      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("marks each segment as disabled", () => {
      render(<DateField label="Date of birth" isDisabled />);
      for (const segment of screen.getAllByRole("spinbutton")) {
        expect(segment).toHaveAttribute("aria-disabled", "true");
      }
    });
  });

  describe("invalid state", () => {
    it("marks the input group as invalid", () => {
      render(<DateField label="Date of birth" isInvalid />);
      // React Aria uses data-invalid rather than aria-invalid on the group
      expect(screen.getByRole("group")).toHaveAttribute("data-invalid", "true");
    });
  });
});
