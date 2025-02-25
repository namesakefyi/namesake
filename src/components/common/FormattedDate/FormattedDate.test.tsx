import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FormattedDate } from "./FormattedDate";
describe("FormattedDate", () => {
  const originalLanguage = navigator.language;

  afterEach(() => {
    Object.defineProperty(navigator, "language", {
      value: originalLanguage,
      configurable: true,
    });
  });

  it("renders date in US format when locale is en-US", () => {
    // Mock navigator.language
    Object.defineProperty(navigator, "language", {
      value: "en-US",
      configurable: true,
    });

    const testDate = new Date("2024-03-14T12:00:00.000Z");
    render(<FormattedDate date={testDate} />);

    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveAttribute("datetime", "2024-03-14T12:00:00.000Z");
    expect(timeElement.textContent).toBe("Mar 14, 2024");
  });

  it("renders date in UK format when locale is en-GB", () => {
    // Mock navigator.language
    Object.defineProperty(navigator, "language", {
      value: "en-GB",
      configurable: true,
    });

    const testDate = new Date("2024-03-14T12:00:00.000Z");
    render(<FormattedDate date={testDate} />);

    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveAttribute("datetime", "2024-03-14T12:00:00.000Z");
    expect(timeElement.textContent).toBe("14 Mar 2024");
  });
});
