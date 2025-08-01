import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PasswordStrength, strengthConfig } from "./PasswordStrength";

describe("PasswordStrength", () => {
  const strengthConfigs = Object.entries(strengthConfig).map(
    ([value, config]) => ({
      value: Number(value),
      label: config.label,
      textClass: config.color.text,
      bgClass: config.color.bg,
    }),
  );

  it.each(strengthConfigs)(
    "renders label $label and styles for value $value",
    ({ value, label, textClass, bgClass }) => {
      render(<PasswordStrength value={value} />);

      // Check screen reader strength label
      const srLabel = screen.getByText(label);
      expect(srLabel).toBeInTheDocument();
      expect(srLabel).toHaveClass("sr-only");

      // Check visible label
      const visibleLabel = screen.getByTestId("strength-label");
      expect(visibleLabel).toBeInTheDocument();
      expect(visibleLabel).toHaveClass(textClass);

      // Check meter background
      const progressBar = screen.getByTestId("meter-fill");
      expect(progressBar).toHaveClass(bgClass);
    },
  );

  it("throws error for invalid strength values", () => {
    const invalidValues = [-1, 5];

    for (const value of invalidValues) {
      expect(() => {
        render(<PasswordStrength value={value as any} />);
      }).toThrow("Value must be between 0 and 4");
    }
  });
});
