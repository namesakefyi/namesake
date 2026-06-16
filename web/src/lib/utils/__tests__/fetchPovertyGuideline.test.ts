import { describe, expect, it, vi } from "vitest";
import { fetchPovertyGuideline } from "../fetchPovertyGuideline";

const mockResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

const API_RESPONSE = {
  data: { year: "2026", state: "US", household_size: "4", income: "32150" },
  method: "GET",
  status: 200,
};

describe("fetchPovertyGuideline", () => {
  it("returns parsed guideline data on success", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(API_RESPONSE));

    const result = await fetchPovertyGuideline(2026, 4);

    expect(result).toEqual({
      year: 2026,
      state: "US",
      householdSize: 4,
      povertyThreshold: 32150,
    });
  });

  it("builds the correct URL", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(API_RESPONSE));

    await fetchPovertyGuideline(2026, 4);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines/api/2026/us/4",
    );
  });

  it("passes state through to the URL", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(API_RESPONSE));

    await fetchPovertyGuideline(2026, 4, "ak");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines/api/2026/ak/4",
    );
  });

  it("clamps household size below 1 to 1", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(API_RESPONSE));

    await fetchPovertyGuideline(2026, 0);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/1"));
  });

  it("clamps household size above 8 to 8", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(API_RESPONSE));

    await fetchPovertyGuideline(2026, 12);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/8"));
  });

  it("returns null on a non-ok response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(null, 404));

    const result = await fetchPovertyGuideline(2026, 4);

    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchPovertyGuideline(2026, 4);

    expect(result).toBeNull();
  });
});
