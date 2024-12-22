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

      // Check strength label
      const strengthLabel = screen.getByLabelText(label);
      expect(strengthLabel).toBeInTheDocument();
      expect(strengthLabel).toHaveClass(textClass);

      // Check meter background
      const progressBar = screen.getByTestId("meter-fill");
      expect(progressBar).toHaveClass(bgClass);
    },
  );

  it("displays warning banner when warning prop is provided", () => {
    const warningMessage = "Password is too common";
    render(<PasswordStrength value={2} warning={warningMessage} />);

    const warningBanner = screen.getByText(warningMessage);
    expect(warningBanner).toBeInTheDocument();
  });

  it("displays suggestions banner when suggestions are provided", () => {
    const suggestions = ["Add a number", "Include a special character"];
    render(<PasswordStrength value={2} suggestions={suggestions} />);

    for (const suggestion of suggestions) {
      const suggestionItem = screen.getByText(suggestion);
      expect(suggestionItem).toBeInTheDocument();
    }
  });

  it("throws error for invalid strength values", () => {
    const invalidValues = [-1, 5];

    for (const value of invalidValues) {
      expect(() => {
        render(<PasswordStrength value={value as any} />);
      }).toThrow("Value must be between 0 and 4");
    }
  });

  it("renders without warnings or suggestions when not provided", () => {
    render(<PasswordStrength value={3} />);

    const warningBanner = screen.queryByRole("alert");
    expect(warningBanner).not.toBeInTheDocument();
  });
});
