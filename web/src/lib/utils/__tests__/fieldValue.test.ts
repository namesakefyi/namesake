import { describe, expect, it } from "vitest";
import { asList, asText } from "../fieldValue";

describe("asText", () => {
  it("keeps text and drops other answers", () => {
    expect(asText("Ontario")).toBe("Ontario");
    expect(asText(true)).toBeUndefined();
    expect(asText(["a"])).toBeUndefined();
  });
});

describe("asList", () => {
  it("keeps lists and drops other answers", () => {
    expect(asList(["a", "b"])).toEqual(["a", "b"]);
    expect(asList("a")).toBeUndefined();
    expect(asList(undefined)).toBeUndefined();
  });
});
