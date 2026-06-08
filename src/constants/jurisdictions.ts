const usaStates = [
  { name: "Alabama", abbreviation: "AL", territory: false },
  { name: "Alaska", abbreviation: "AK", territory: false },
  { name: "American Samoa", abbreviation: "AS", territory: true },
  { name: "Arizona", abbreviation: "AZ", territory: false },
  { name: "Arkansas", abbreviation: "AR", territory: false },
  { name: "California", abbreviation: "CA", territory: false },
  { name: "Colorado", abbreviation: "CO", territory: false },
  { name: "Connecticut", abbreviation: "CT", territory: false },
  { name: "Delaware", abbreviation: "DE", territory: false },
  { name: "District Of Columbia", abbreviation: "DC", territory: false },
  { name: "Florida", abbreviation: "FL", territory: false },
  { name: "Georgia", abbreviation: "GA", territory: false },
  { name: "Guam", abbreviation: "GU", territory: true },
  { name: "Hawaii", abbreviation: "HI", territory: false },
  { name: "Idaho", abbreviation: "ID", territory: false },
  { name: "Illinois", abbreviation: "IL", territory: false },
  { name: "Indiana", abbreviation: "IN", territory: false },
  { name: "Iowa", abbreviation: "IA", territory: false },
  { name: "Kansas", abbreviation: "KS", territory: false },
  { name: "Kentucky", abbreviation: "KY", territory: false },
  { name: "Louisiana", abbreviation: "LA", territory: false },
  { name: "Maine", abbreviation: "ME", territory: false },
  { name: "Maryland", abbreviation: "MD", territory: false },
  { name: "Massachusetts", abbreviation: "MA", territory: false },
  { name: "Michigan", abbreviation: "MI", territory: false },
  { name: "Minnesota", abbreviation: "MN", territory: false },
  { name: "Mississippi", abbreviation: "MS", territory: false },
  { name: "Missouri", abbreviation: "MO", territory: false },
  { name: "Montana", abbreviation: "MT", territory: false },
  { name: "Nebraska", abbreviation: "NE", territory: false },
  { name: "Nevada", abbreviation: "NV", territory: false },
  { name: "New Hampshire", abbreviation: "NH", territory: false },
  { name: "New Jersey", abbreviation: "NJ", territory: false },
  { name: "New Mexico", abbreviation: "NM", territory: false },
  { name: "New York", abbreviation: "NY", territory: false },
  { name: "North Carolina", abbreviation: "NC", territory: false },
  { name: "North Dakota", abbreviation: "ND", territory: false },
  { name: "Northern Mariana Islands", abbreviation: "MP", territory: true },
  { name: "Ohio", abbreviation: "OH", territory: false },
  { name: "Oklahoma", abbreviation: "OK", territory: false },
  { name: "Oregon", abbreviation: "OR", territory: false },
  { name: "Pennsylvania", abbreviation: "PA", territory: false },
  { name: "Puerto Rico", abbreviation: "PR", territory: true },
  { name: "Rhode Island", abbreviation: "RI", territory: false },
  { name: "South Carolina", abbreviation: "SC", territory: false },
  { name: "South Dakota", abbreviation: "SD", territory: false },
  { name: "Tennessee", abbreviation: "TN", territory: false },
  { name: "Texas", abbreviation: "TX", territory: false },
  { name: "Utah", abbreviation: "UT", territory: false },
  { name: "Vermont", abbreviation: "VT", territory: false },
  { name: "Virgin Islands", abbreviation: "VI", territory: true },
  { name: "Virginia", abbreviation: "VA", territory: false },
  { name: "Washington", abbreviation: "WA", territory: false },
  { name: "West Virginia", abbreviation: "WV", territory: false },
  { name: "Wisconsin", abbreviation: "WI", territory: false },
  { name: "Wyoming", abbreviation: "WY", territory: false },
] as const;

/**
 * Jurisdictions, a.k.a. US States and territories.
 */
export const JURISDICTIONS = usaStates.reduce(
  (acc, state) => {
    acc[state.abbreviation] = state.name;
    return acc;
  },
  {} as Record<string, string>,
);

export type Jurisdiction = (typeof usaStates)[number]["abbreviation"];

/** Lowercase state/territory abbreviation, matching content collection state IDs. */
export type StateId = Lowercase<Jurisdiction>;
