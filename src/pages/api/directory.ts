import { sanityClient } from "sanity:client";
import type { APIRoute } from "astro";
import { parseDirectorySearchParams } from "@/directory/parseDirectorySearchParams";
import { DIRECTORY_CONTACTS_LIST_QUERY } from "@/sanity/queries";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const { selectedStateSlug, selectedService } = parseDirectorySearchParams(
    url.searchParams,
  );

  const contacts = await sanityClient.fetch(DIRECTORY_CONTACTS_LIST_QUERY, {
    stateSlug: selectedStateSlug,
    service: selectedService,
  });

  return Response.json({ contacts });
};
