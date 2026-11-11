import type { FormData } from "#lib/forms/questions";

export const requestsNameChange = (data: FormData) =>
  data.nyCourtOrderRequest === "Name change" ||
  data.nyCourtOrderRequest === "Both";

export const requestsSexDesignationChange = (data: FormData) =>
  data.nyCourtOrderRequest === "Sex designation change" ||
  data.nyCourtOrderRequest === "Both";

const NEW_YORK_CITY_COUNTIES = [
  "Bronx",
  "Kings",
  "New York",
  "Queens",
  "Richmond",
];

export const livesInNewYorkCity = (data: FormData) =>
  NEW_YORK_CITY_COUNTIES.includes(data.residenceCounty ?? "");
