import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimeAgo } from "./TimeAgo";
import { getRelativeTimeString } from "./TimeAgo";

describe("TimeAgo", () => {
  it("renders the relative time with correct title and datetime attributes", () => {
    const date = new Date("2024-03-20T12:00:00Z");
    render(<TimeAgo date={date} />);

    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveAttribute("dateTime", date.toISOString());
    expect(timeElement).toHaveAttribute("title", date.toLocaleString());
  });
});

describe("getRelativeTimeString", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for times less than 60 seconds ago", () => {
    const now = new Date("2024-03-20T12:00:00Z");
    vi.setSystemTime(now);

    const date = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
    expect(getRelativeTimeString(date, "en")).toBe("just now");
  });

  it("formats times in the past correctly", () => {
    const now = new Date("2024-03-20T12:00:00Z");
    vi.setSystemTime(now);

    const testCases = [
      {
        date: new Date(now.getTime() - 2 * 60 * 1000),
        expected: "2 minutes ago",
      },
      {
        date: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        expected: "3 hours ago",
      },
      {
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        expected: "2 days ago",
      },
      {
        date: new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000),
        expected: "2 weeks ago",
      },
    ];

    for (const { date, expected } of testCases) {
      expect(getRelativeTimeString(date, "en")).toBe(expected);
    }
  });

  it("formats times in the future correctly", () => {
    const now = new Date("2024-03-20T12:00:00Z");
    vi.setSystemTime(now);

    const testCases = [
      {
        date: new Date(now.getTime() + 2 * 60 * 1000),
        expected: "in 2 minutes",
      },
      {
        date: new Date(now.getTime() + 3 * 60 * 60 * 1000),
        expected: "in 3 hours",
      },
      {
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        expected: "in 2 days",
      },
    ];

    for (const { date, expected } of testCases) {
      expect(getRelativeTimeString(date, "en")).toBe(expected);
    }
  });

  it("handles different languages correctly", () => {
    const now = new Date("2024-03-20T12:00:00Z");
    vi.setSystemTime(now);

    const date = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
    expect(getRelativeTimeString(date, "es")).toBe("hace 2 minutos");
    expect(getRelativeTimeString(date, "fr")).toBe("il y a 2 minutes");
  });
});
