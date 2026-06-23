import type { AsyncListLoadFunction } from "react-aria-components";
import { describe, expect, it, vi } from "vitest";
import {
  createLocationLoader,
  fetchLocations,
  type GeoapifyResult,
} from "../fetchLocationResults";

const sampleResult: GeoapifyResult = {
  address_line1: "123 Main St",
  county: "Sangamon",
  postcode: "62704",
  state_code: "IL",
  city: "Springfield",
  street: "Main St",
  housenumber: "123",
  formatted: "123 Main St, Springfield, IL 62704",
  place_id: "abc123",
};

const okResponse = (results: unknown[]) =>
  new Response(JSON.stringify({ results }), { status: 200 });

// The loader only reads `filterText` and `signal`; cast a minimal options object
// rather than enumerating the full AsyncList load signature.
type LoadFn = AsyncListLoadFunction<GeoapifyResult, string>;
const runLoad = (
  load: LoadFn,
  filterText: string,
  signal: AbortSignal = new AbortController().signal,
) => load({ filterText, signal } as unknown as Parameters<LoadFn>[0]);

describe("fetchLocations", () => {
  it("returns the results array on a successful response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(okResponse([sampleResult]));

    const result = await fetchLocations("123 main");

    expect(result).toEqual([sampleResult]);
  });

  it("builds an encoded URL and forwards the abort signal", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(okResponse([]));
    const { signal } = new AbortController();

    await fetchLocations("123 Main St", signal);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/location?text=123%20Main%20St",
      { signal },
    );
  });

  it("throws on a non-ok response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(null, { status: 500 }),
    );

    await expect(fetchLocations("123 main")).rejects.toThrow(
      "Location API 500",
    );
  });
});

describe("createLocationLoader", () => {
  it("returns items for a query", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(okResponse([sampleResult]));

    const load = createLocationLoader(0);
    const result = await runLoad(load, "123 main");

    expect(result.items).toEqual([sampleResult]);
  });

  it("short-circuits empty filter text without fetching", async () => {
    const load = createLocationLoader(0);
    const result = await runLoad(load, "");

    expect(result.items).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("latches off after a real failure and stops fetching", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(null, { status: 500 }),
    );

    const load = createLocationLoader(0);
    const first = await runLoad(load, "fails");
    const second = await runLoad(load, "again");

    expect(first.items).toEqual([]);
    expect(second.items).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1); // second call never hit the network
  });

  it("does NOT latch when a request is aborted by a newer keystroke", async () => {
    const controller = new AbortController();
    const load = createLocationLoader(0);

    // Abort during the debounce window: the request never reaches the network,
    // and the abort is re-thrown rather than swallowed as a failure.
    const pending = runLoad(load, "typing", controller.signal);
    controller.abort();
    await expect(pending).rejects.toThrow();
    expect(global.fetch).not.toHaveBeenCalled();

    // Latch stayed off, so a later query still works.
    vi.mocked(global.fetch).mockResolvedValueOnce(okResponse([sampleResult]));
    const result = await runLoad(load, "works now");

    expect(result.items).toEqual([sampleResult]);
  });

  it("debounces for 200 ms before sending a request", async () => {
    const controller = new AbortController();
    vi.mocked(global.fetch).mockResolvedValueOnce(okResponse([sampleResult]));

    const load = createLocationLoader();
    const pending = runLoad(load, "typing", controller.signal);

    // Abort after 50 ms
    new Promise<void>((resolve) => {
      setTimeout(() => {
        controller.abort();
        resolve();
      }, 10);
    });

    // The abort is re-thrown, not swallowed as a failure.
    await expect(pending).rejects.toThrow();

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
