import { describe, expect, it } from "vitest";
import { formatCleanUrl } from "../formatCleanUrl";

describe("formatCleanUrl", () => {
  it("strips https, www, and trailing slash", () => {
    expect(formatCleanUrl("https://www.masstpc.org/")).toBe("masstpc.org");
  });

  it("strips http and optional www", () => {
    expect(formatCleanUrl("http://www.example.com")).toBe("example.com");
    expect(formatCleanUrl("http://example.com")).toBe("example.com");
  });

  it("strips https when www is absent", () => {
    expect(formatCleanUrl("https://namesake.fyi/")).toBe("namesake.fyi");
  });

  it("leaves host-only strings unchanged", () => {
    expect(formatCleanUrl("example.com")).toBe("example.com");
  });

  it("omits the path, query, and fragment", () => {
    expect(
      formatCleanUrl(
        "https://law.uic.edu/experiential-education/clinics/pro-bono/projects/?source=directory#services",
      ),
    ).toBe("law.uic.edu");
  });
});
