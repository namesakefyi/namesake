/**
 * Jurisdictions, a.k.a. US States and territories, keyed by lowercase
 * abbreviation (matching content collection jurisdiction IDs).
 */
export const JURISDICTIONS = {
  al: { name: "Alabama", territory: false, namesakeSupport: "none" },
  ak: { name: "Alaska", territory: false, namesakeSupport: "none" },
  as: { name: "American Samoa", territory: true, namesakeSupport: "none" },
  az: { name: "Arizona", territory: false, namesakeSupport: "none" },
  ar: { name: "Arkansas", territory: false, namesakeSupport: "none" },
  ca: { name: "California", territory: false, namesakeSupport: "none" },
  co: { name: "Colorado", territory: false, namesakeSupport: "none" },
  ct: { name: "Connecticut", territory: false, namesakeSupport: "none" },
  de: { name: "Delaware", territory: false, namesakeSupport: "none" },
  dc: {
    name: "District of Columbia",
    territory: false,
    namesakeSupport: "none",
  },
  fl: { name: "Florida", territory: false, namesakeSupport: "none" },
  ga: { name: "Georgia", territory: false, namesakeSupport: "none" },
  gu: { name: "Guam", territory: true, namesakeSupport: "none" },
  hi: { name: "Hawaii", territory: false, namesakeSupport: "none" },
  id: { name: "Idaho", territory: false, namesakeSupport: "none" },
  il: { name: "Illinois", territory: false, namesakeSupport: "prioritized" },
  in: { name: "Indiana", territory: false, namesakeSupport: "none" },
  ia: { name: "Iowa", territory: false, namesakeSupport: "none" },
  ks: { name: "Kansas", territory: false, namesakeSupport: "none" },
  ky: { name: "Kentucky", territory: false, namesakeSupport: "none" },
  la: { name: "Louisiana", territory: false, namesakeSupport: "none" },
  me: { name: "Maine", territory: false, namesakeSupport: "none" },
  md: { name: "Maryland", territory: false, namesakeSupport: "none" },
  ma: { name: "Massachusetts", territory: false, namesakeSupport: "full" },
  mi: { name: "Michigan", territory: false, namesakeSupport: "none" },
  mn: { name: "Minnesota", territory: false, namesakeSupport: "none" },
  ms: { name: "Mississippi", territory: false, namesakeSupport: "none" },
  mo: { name: "Missouri", territory: false, namesakeSupport: "none" },
  mt: { name: "Montana", territory: false, namesakeSupport: "none" },
  ne: { name: "Nebraska", territory: false, namesakeSupport: "none" },
  nv: { name: "Nevada", territory: false, namesakeSupport: "none" },
  nh: { name: "New Hampshire", territory: false, namesakeSupport: "none" },
  nj: { name: "New Jersey", territory: false, namesakeSupport: "none" },
  nm: { name: "New Mexico", territory: false, namesakeSupport: "none" },
  ny: { name: "New York", territory: false, namesakeSupport: "prioritized" },
  nc: { name: "North Carolina", territory: false, namesakeSupport: "none" },
  nd: { name: "North Dakota", territory: false, namesakeSupport: "none" },
  mp: {
    name: "Northern Mariana Islands",
    territory: true,
    namesakeSupport: "none",
  },
  oh: { name: "Ohio", territory: false, namesakeSupport: "none" },
  ok: { name: "Oklahoma", territory: false, namesakeSupport: "none" },
  or: { name: "Oregon", territory: false, namesakeSupport: "none" },
  pa: { name: "Pennsylvania", territory: false, namesakeSupport: "none" },
  pr: { name: "Puerto Rico", territory: true, namesakeSupport: "none" },
  ri: { name: "Rhode Island", territory: false, namesakeSupport: "full" },
  sc: { name: "South Carolina", territory: false, namesakeSupport: "none" },
  sd: { name: "South Dakota", territory: false, namesakeSupport: "none" },
  tn: { name: "Tennessee", territory: false, namesakeSupport: "none" },
  tx: { name: "Texas", territory: false, namesakeSupport: "none" },
  ut: { name: "Utah", territory: false, namesakeSupport: "none" },
  vt: { name: "Vermont", territory: false, namesakeSupport: "none" },
  vi: { name: "Virgin Islands", territory: true, namesakeSupport: "none" },
  va: { name: "Virginia", territory: false, namesakeSupport: "none" },
  wa: { name: "Washington", territory: false, namesakeSupport: "none" },
  wv: { name: "West Virginia", territory: false, namesakeSupport: "none" },
  wi: { name: "Wisconsin", territory: false, namesakeSupport: "none" },
  wy: { name: "Wyoming", territory: false, namesakeSupport: "none" },
} as const satisfies Record<
  string,
  {
    name: string;
    territory: boolean;
    namesakeSupport: "full" | "prioritized" | "none";
  }
>;

/** Lowercase state/territory abbreviation, matching content collection jurisdiction IDs. */
export type JurisdictionId = keyof typeof JURISDICTIONS;

/** `{ label, value }` options for jurisdiction selects/comboboxes. */
export const JURISDICTION_OPTIONS = Object.entries(JURISDICTIONS).map(
  ([id, jurisdiction]) => ({
    label: jurisdiction.name,
    value: id.toUpperCase(),
  }),
);
