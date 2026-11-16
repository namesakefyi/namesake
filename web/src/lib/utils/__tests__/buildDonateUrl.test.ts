import { describe, expect, it } from "vitest";
import { buildDonateUrl } from "../buildDonateUrl";

describe("buildDonateUrl", () => {
  it("should link to the Every.org donation form with suggested amounts", () => {
    expect(buildDonateUrl()).toBe(
      "https://www.every.org/namesake?suggestedAmounts=10%2C25%2C50%2C100&theme_color=111111&method=card%2Cbank%2Cpaypal%2Cvenmo%2Cpay%2Cdaf&utm_campaign=donate-link#/donate",
    );
  });

  it("should prefill the amount and frequency", () => {
    const url = new URL(buildDonateUrl({ amount: 25, frequency: "monthly" }));
    expect(url.searchParams.get("amount")).toBe("25");
    expect(url.searchParams.get("frequency")).toBe("monthly");
    expect(url.hash).toBe("#/donate");
  });
});
