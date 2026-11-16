import { describe, expect, it } from "vitest";
import { siteInfo } from "#constants/site-info";
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
  it("should open the donate form for the nonprofit", () => {
    const url = new URL(buildEveryOrgUrl());
    expect(url.origin).toBe("https://www.every.org");
    expect(url.pathname).toBe(`/${siteInfo.donation.nonprofitSlug}`);
    expect(url.hash).toBe("#/donate");
  });

  it("should pass the theme color without a leading #", () => {
    const url = new URL(buildEveryOrgUrl());
    expect(url.searchParams.get("theme_color")).toMatch(/^[0-9a-f]{6}$/i);
  });

  it("should list suggested amounts as comma-separated values", () => {
    const url = new URL(buildEveryOrgUrl());
    expect(
      url.searchParams.get("suggestedAmounts")?.split(",").map(Number),
    ).toEqual(siteInfo.donation.suggestedAmounts);
  });

  it("should prefill the amount and frequency only when given", () => {
    expect(new URL(buildEveryOrgUrl()).searchParams.has("amount")).toBe(false);
    const url = new URL(buildEveryOrgUrl({ amount: 25, frequency: "monthly" }));
    expect(url.searchParams.get("amount")).toBe("25");
    expect(url.searchParams.get("frequency")).toBe("monthly");
  });
});
