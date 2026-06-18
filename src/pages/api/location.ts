import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";

export const prerender = false;

export interface GeoapifyResult {
  county: string;
  postcode: string;
  state_code: string;
  city: string;
  street: any;
  housenumber: any;
  formatted: string;
  place_id: string;
}

export const GET: APIRoute = async ({ url }) => {
  const text = url.searchParams.get("text");
  if (!text) {
    return Response.json(
      { error: "Missing 'text'" },
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const geoapifyApiKey = env?.GEOAPIFY_API_KEY as string | undefined;

  if (!geoapifyApiKey) {
    return Response.json(
      { error: "Geoapify missing api key" },
      {
        status: 500,
      },
    );
  }

  const geoapify = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  geoapify.searchParams.set("text", text);
  geoapify.searchParams.set("filter", "countrycode:us");
  geoapify.searchParams.set("format", "json");
  geoapify.searchParams.set("apiKey", geoapifyApiKey);

  const geoapifyResponse = await fetch(geoapify);

  if (!geoapifyResponse.ok) {
    return Response.json(
      { error: "Geoapify request failed" },
      { status: geoapifyResponse.status },
    );
  }

  const results = await geoapifyResponse.json();

  return Response.json(results);
};
