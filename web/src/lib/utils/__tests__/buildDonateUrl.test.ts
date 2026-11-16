import { describe, expect, it } from "vitest";
import { buildDonatePath, buildEveryOrgUrl } from "../buildDonateUrl";

describe("buildDonatePath", () => {
  it("should link to the donate page without options", () => {
    expect(buildDonatePath()).toBe("/donate");
  });

  it("should add the amount and frequency to the query string", () => {
    expect(buildDonatePath({ amount: 25 })).toBe("/donate?amount=25");
    expect(buildDonatePath({ amount: 25, frequency: "monthly" })).toBe(
      "/donate?amount=25&frequency=monthly",
    );
  });
});

describe("buildEveryOrgUrl", () => {
  it("should link to the Every.org donation form with suggested amounts", () => {
    expect(buildEveryOrgUrl()).toBe(
      "https://www.every.org/namesake?suggestedAmounts=10%2C25%2C50%2C100&theme_color=111111&method=card%2Cbank%2Cpaypal%2Cvenmo%2Cpay%2Cdaf&utm_campaign=donate-link#/donate",
    );
  });

  it("should prefill the amount and frequency", () => {
    const url = new URL(buildEveryOrgUrl({ amount: 25, frequency: "monthly" }));
    expect(url.searchParams.get("amount")).toBe("25");
    expect(url.searchParams.get("frequency")).toBe("monthly");
  });
});
