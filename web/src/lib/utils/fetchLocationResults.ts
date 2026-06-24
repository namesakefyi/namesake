import type { AsyncListLoadFunction } from "react-aria-components";

export interface GeoapifyResult {
  address_line1: string;
  county: string;
  postcode: string;
  state_code: string;
  city: string;
  street: string;
  housenumber: string;
  formatted: string;
  place_id: string;
}

/**
 * Given partial address text, return matching location results from the
 * Geoapify-backed location API.
 *
 * @example
 * await fetchLocations("123 Main St, Boston")
 * // [{ formatted: "123 Main St, Boston, MA 02108, United States", ... }]
 */
export async function fetchLocations(
  text: string,
  signal?: AbortSignal,
): Promise<GeoapifyResult[]> {
  const res = await fetch(`/api/location?text=${encodeURIComponent(text)}`, {
    signal,
  });
  if (!res.ok) throw new Error(`Location API ${res.status}`);
  const json: { results: GeoapifyResult[] } = await res.json();
  return json.results;
}

async function sleep(durationMs: number, signal?: AbortSignal) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, durationMs);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(signal.reason);
      });
    }
  });
}

/**
 * Given a debounce delay, return an async list loader for `<ComboBox>`-style
 * location fields, debouncing requests and giving up on the API after one failure.
 *
 * @example
 * createLocationLoader(200)
 * // ({ signal, filterText }) => Promise<{ items: GeoapifyResult[] }>
 */
export function createLocationLoader(
  debounceMs = 200,
): AsyncListLoadFunction<GeoapifyResult, string> {
  let apiFailed = false;
  return async ({ signal, filterText }) => {
    if (!filterText || apiFailed) return { items: [] };
    try {
      // Debounce the request, if the abort signal is sent
      // by typing another key, the sleep aborts and we start over again
      // with a new sleep call.
      await sleep(debounceMs, signal);
      return { items: await fetchLocations(filterText, signal) };
    } catch (err) {
      if (signal.aborted) throw err; // cancellation, not a failure
      apiFailed = true;
      return { items: [] };
    }
  };
}
