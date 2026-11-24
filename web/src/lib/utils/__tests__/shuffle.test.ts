import { afterEach, describe, expect, it, vi } from "vitest";
import { shuffle } from "../shuffle";

describe("shuffle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the same items", () => {
    const items = [1, 2, 3, 4, 5];

    expect(shuffle(items).toSorted()).toEqual(items);
  });

  it("does not modify the original array", () => {
    const items = [1, 2, 3];

    shuffle(items);

    expect(items).toEqual([1, 2, 3]);
  });

  it("orders items by their random sort keys", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5);

    expect(shuffle(["a", "b", "c"])).toEqual(["b", "c", "a"]);
  });

  it("returns an empty array for no items", () => {
    expect(shuffle([])).toEqual([]);
  });
});
