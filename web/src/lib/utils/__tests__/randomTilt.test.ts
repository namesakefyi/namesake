import { afterEach, describe, expect, it, vi } from "vitest";
import { randomTilt } from "../randomTilt";

describe("randomTilt", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the most negative tilt for the lowest random value", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(randomTilt()).toBe("-3.00deg");
  });

  it("returns no tilt for the middle random value", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    expect(randomTilt()).toBe("0.00deg");
  });

  it("scales to the given maximum", () => {
    vi.spyOn(Math, "random").mockReturnValue(1);

    expect(randomTilt(10)).toBe("10.00deg");
  });
});
