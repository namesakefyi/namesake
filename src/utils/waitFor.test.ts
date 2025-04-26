import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { waitFor } from "./waitFor";

describe("waitFor", () => {
  beforeEach(() => {
    // Setup fake timers before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks();
  });

  it("should resolve immediately when condition is already true", async () => {
    const condition = vi.fn(() => true);
    const promise = waitFor(condition);

    await vi.runAllTimersAsync();
    await promise;

    expect(condition).toHaveBeenCalledTimes(1);
  });

  it("should wait until condition becomes true", async () => {
    let counter = 0;
    const condition = vi.fn(() => {
      counter++;
      return counter >= 3;
    });

    const promise = waitFor(condition);

    // Run timers multiple times to simulate polling
    await vi.runAllTimersAsync();
    await promise;

    expect(condition).toHaveBeenCalledTimes(3);
  });

  it("should poll every 10ms until condition is met", async () => {
    let conditionMet = false;
    const condition = vi.fn(() => conditionMet);

    const promise = waitFor(condition);

    // Advance timer by 25ms (should call condition 3 times)
    await vi.advanceTimersByTimeAsync(25);
    expect(condition).toHaveBeenCalledTimes(3);

    // Make condition true and run remaining timers
    conditionMet = true;
    await vi.runAllTimersAsync();
    await promise;

    expect(condition).toHaveBeenCalledTimes(4);
  });
});
