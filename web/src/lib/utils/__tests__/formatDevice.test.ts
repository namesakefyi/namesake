import { describe, expect, it } from "vitest";
import { formatDevice } from "../formatDevice";

describe("formatDevice", () => {
  it("should return 'this device' when null is provided", () => {
    expect(formatDevice(null)).toBe("this device");
  });

  it("should return 'this device' when empty object is provided", () => {
    expect(formatDevice({})).toBe("this device");
  });

  it("should return vendor and model when both are provided", () => {
    expect(
      formatDevice({ type: "mobile", vendor: "Apple", model: "iPhone" }),
    ).toBe("this Apple iPhone");
    expect(formatDevice({ vendor: "Samsung", model: "Galaxy S23" })).toBe(
      "this Samsung Galaxy S23",
    );
  });

  it("should return just the vendor when model is not provided", () => {
    expect(formatDevice({ vendor: "Apple" })).toBe("this Apple");
    expect(formatDevice({ vendor: "Samsung" })).toBe("this Samsung");
  });

  it("should return 'this device' when only model is provided without vendor", () => {
    expect(formatDevice({ model: "iPhone" })).toBe("this device");
  });

  it("should return 'this device' when vendor is undefined", () => {
    expect(formatDevice({ vendor: undefined, model: "iPhone" })).toBe(
      "this device",
    );
  });
});
