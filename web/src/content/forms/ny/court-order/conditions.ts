import type { Data } from "#lib/forms/questions";

export const requestsNameChange = (data: Data) =>
  data.nyCourtOrderRequest === "Name change" ||
  data.nyCourtOrderRequest === "Both";

export const requestsSexDesignationChange = (data: Data) =>
  data.nyCourtOrderRequest === "Sex designation change" ||
  data.nyCourtOrderRequest === "Both";

const NEW_YORK_CITY_COUNTIES = [
  "Bronx",
  "Kings",
  "New York",
  "Queens",
  "Richmond",
];

export const livesInNewYorkCity = (data: Data) =>
  NEW_YORK_CITY_COUNTIES.includes(data.residenceCounty ?? "");
