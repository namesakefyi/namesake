import { describe, expect, it } from "vitest";
import { combineConditions, traceReads, withDeps } from "../conditions";
import type { Condition } from "../types";

const married: Condition = (data) => data.isCurrentlyMarried === true;
const divorced: Condition = (data) => data.wasPreviouslyMarried === true;

describe("combineConditions", () => {
  it("requires every condition that is present", () => {
    const both = combineConditions([married, undefined, divorced]);
    expect(both?.({ isCurrentlyMarried: true })).toBe(false);
    expect(
      both?.({ isCurrentlyMarried: true, wasPreviouslyMarried: true }),
    ).toBe(true);
  });

  it("returns undefined when no condition is present", () => {
    expect(combineConditions([undefined, undefined])).toBeUndefined();
  });

  it("returns a single condition unchanged", () => {
    expect(combineConditions([married])).toBe(married);
  });
});

describe("traceReads", () => {
  it("lists the fields a plain function reads", () => {
    expect(
      traceReads(
        (data) =>
          data.isCurrentlyMarried === true ||
          data.wasPreviouslyMarried === true,
      ),
    ).toEqual(["isCurrentlyMarried", "wasPreviouslyMarried"]);
  });

  it("adds fields declared with withDeps", () => {
    const request = withDeps(
      (data) =>
        data.nyCourtOrderRequest === "Both" && data.isCurrentlyMarried === true,
      ["isCurrentlyMarried"],
    );
    expect(traceReads(request)).toEqual(
      expect.arrayContaining(["nyCourtOrderRequest", "isCurrentlyMarried"]),
    );
  });
});
