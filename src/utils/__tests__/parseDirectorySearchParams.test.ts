import { describe, expect, it } from "vitest";
import { parseDirectorySearchParams } from "../parseDirectorySearchParams";

function params(query: string): URLSearchParams {
  return new URLSearchParams(query);
}

describe("parseDirectorySearchParams", () => {
  it("returns empty strings when params are absent", () => {
    expect(parseDirectorySearchParams(params(""))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
  });

  it("accepts a two-letter lowercase state slug", () => {
    expect(parseDirectorySearchParams(params("state=ca"))).toEqual({
      selectedStateSlug: "ca",
      selectedService: "",
    });
  });

  it("rejects state that is not exactly two lowercase letters", () => {
    expect(parseDirectorySearchParams(params("state=C"))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
    expect(parseDirectorySearchParams(params("state=CA"))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
    expect(parseDirectorySearchParams(params("state=cal"))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
    expect(parseDirectorySearchParams(params("state=c1"))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
    expect(parseDirectorySearchParams(params("state=12"))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
  });

  it("accepts a known service id", () => {
    expect(parseDirectorySearchParams(params("service=legal"))).toEqual({
      selectedStateSlug: "",
      selectedService: "legal",
    });
    expect(
      parseDirectorySearchParams(params("service=nameChangeClinic")),
    ).toEqual({
      selectedStateSlug: "",
      selectedService: "nameChangeClinic",
    });
  });

  it("rejects unknown service values", () => {
    expect(parseDirectorySearchParams(params("service=unknown"))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
    expect(parseDirectorySearchParams(params("service="))).toEqual({
      selectedStateSlug: "",
      selectedService: "",
    });
  });

  it("parses both state and service when valid", () => {
    expect(
      parseDirectorySearchParams(params("state=ny&service=financialAid")),
    ).toEqual({
      selectedStateSlug: "ny",
      selectedService: "financialAid",
    });
  });

  it("ignores invalid state but still applies valid service", () => {
    expect(
      parseDirectorySearchParams(params("state=NEWYORK&service=notary")),
    ).toEqual({
      selectedStateSlug: "",
      selectedService: "notary",
    });
  });
});
