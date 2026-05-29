const HHS_API_BASE =
  "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines/api";

export interface PovertyGuideline {
  year: number;
  state: string;
  householdSize: number;
  povertyThreshold: number;
}

/**
 * Fetches the federal poverty guideline for a given year, state, and
 * household size from the HHS ASPE API. Household size is clamped to 1–8
 * per API constraints. Returns null on any failure.
 */
export async function fetchPovertyGuideline(
  year: number,
  householdSize: number,
  state = "us",
): Promise<PovertyGuideline | null> {
  const clampedSize = Math.min(Math.max(1, Math.round(householdSize)), 8);
  try {
    const res = await fetch(`${HHS_API_BASE}/${year}/${state}/${clampedSize}`);
    if (!res.ok) return null;
    const json = await res.json() as {
      data: { year: string; state: string; household_size: string; income: string };
    };
    return {
      year: Number(json.data.year),
      state: json.data.state,
      householdSize: Number(json.data.household_size),
      povertyThreshold: Number(json.data.income),
    };
  } catch {
    return null;
  }
}
