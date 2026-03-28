import { sanityClient } from "sanity:client";
import type { APIRoute } from "astro";
import { DIRECTORY_CONTACTS_LIST_QUERY } from "@/sanity/queries";
import { parseDirectorySearchParams } from "@/utils/parseDirectorySearchParams";

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
