import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchAddressSuggestions, isGeoapifyEnabled } from "./geoapify";

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
  });

const SAMPLE = {
  results: [
    {
      place_id: "abc",
      formatted: "123 Main Street, Springfield, IL 62704, United States",
      address_line1: "123 Main Street",
      city: "Springfield",
      state_code: "il",
      county: "Sangamon County",
      postcode: "62704",
    },
  ],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("isGeoapifyEnabled", () => {
  it("is false without an API key", () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "");
    expect(isGeoapifyEnabled()).toBe(false);
  });

  it("is true with an API key", () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "key");
    expect(isGeoapifyEnabled()).toBe(true);
  });
});

describe("fetchAddressSuggestions", () => {
  it("returns an empty list and makes no request without an API key", async () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    expect(await fetchAddressSuggestions("123 Main")).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns an empty list and makes no request for short queries", async () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "key");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    expect(await fetchAddressSuggestions("12")).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps Geoapify results to suggestions with an uppercased state code", async () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "key");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(jsonResponse(SAMPLE))),
    );

    const [suggestion] = await fetchAddressSuggestions("123 Main");

    expect(suggestion).toEqual({
      id: "abc",
      label: "123 Main Street, Springfield, IL 62704, United States",
      street: "123 Main Street",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      county: "Sangamon County",
    });
  });

  it("queries the US-filtered autocomplete endpoint with the API key", async () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "secret");
    const fetchMock = vi.fn((_input: RequestInfo | URL) =>
      Promise.resolve(jsonResponse({ results: [] })),
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchAddressSuggestions("123 Main");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.searchParams.get("apiKey")).toBe("secret");
    expect(url.searchParams.get("filter")).toBe("countrycode:us");
    expect(url.searchParams.get("text")).toBe("123 Main");
  });

  it("throws when the API responds with a non-OK status", async () => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "key");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 429 }))),
    );

    await expect(fetchAddressSuggestions("123 Main")).rejects.toThrow();
  });
});
