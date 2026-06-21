const AUTOCOMPLETE_URL = "https://api.geoapify.com/v1/geocode/autocomplete";
const MIN_QUERY_LENGTH = 3;
const RESULT_LIMIT = 5;

export interface AddressSuggestion {
  /** Geoapify `place_id`, used as the ComboBox item key. */
  id: string;
  /** Full formatted address shown in the suggestion list. */
  label: string;
  street: string;
  city: string;
  /** Two-letter state code (e.g. "CA"), matching JURISDICTIONS keys. */
  state: string;
  zip: string;
  county: string;
}

interface GeoapifyResult {
  place_id?: string;
  formatted?: string;
  address_line1?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  state_code?: string;
  county?: string;
  postcode?: string;
}

const apiKey = (): string | undefined =>
  import.meta.env.PUBLIC_GEOAPIFY_API_KEY;

/** Whether address autocomplete is configured for this environment. */
export const isGeoapifyEnabled = (): boolean => Boolean(apiKey());

function toSuggestion(
  result: GeoapifyResult,
  index: number,
): AddressSuggestion {
  const street =
    result.address_line1 ??
    [result.housenumber, result.street].filter(Boolean).join(" ");

  return {
    id: result.place_id ?? `${result.formatted ?? "result"}-${index}`,
    label: result.formatted ?? street,
    street,
    city: result.city ?? "",
    state: (result.state_code ?? "").toUpperCase(),
    zip: result.postcode ?? "",
    county: result.county ?? "",
  };
}

/**
 * Query Geoapify for US address suggestions. Returns an empty list when the
 * API key is unset or the query is too short, so callers can fall back to
 * manual entry without special-casing the disabled state.
 */
export async function fetchAddressSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const key = apiKey();
  if (!key || query.trim().length < MIN_QUERY_LENGTH) return [];

  const url = new URL(AUTOCOMPLETE_URL);
  url.searchParams.set("text", query);
  url.searchParams.set("apiKey", key);
  url.searchParams.set("format", "json");
  url.searchParams.set("filter", "countrycode:us");
  url.searchParams.set("limit", String(RESULT_LIMIT));

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Geoapify request failed: ${response.status}`);
  }

  const data = (await response.json()) as { results?: GeoapifyResult[] };
  return (data.results ?? []).map(toSuggestion);
}
