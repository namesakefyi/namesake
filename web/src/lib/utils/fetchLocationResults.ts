import type { AsyncListLoadFunction } from "react-aria-components";

export interface GeoapifyResult {
  address_line1: string;
  county: string;
  postcode: string;
  state_code: string;
  city: string;
  street: any;
  housenumber: any;
  formatted: string;
  place_id: string;
}

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

export function createLocationLoader(): AsyncListLoadFunction<
  GeoapifyResult,
  string
> {
  let apiFailed = false;
  return async ({ signal, filterText }) => {
    if (!filterText || apiFailed) return { items: [] };
    try {
      return { items: await fetchLocations(filterText, signal) };
    } catch (err) {
      if (signal.aborted) throw err; // cancellation, not a failure
      apiFailed = true;
      return { items: [] };
    }
  };
}
