import { sanityClient } from "sanity:client";
import type { APIRoute } from "astro";
import { parseDirectorySearchParams } from "../../components/directory/DirectoryList/DirectoryList";
import { DIRECTORY_CONTACTS_LIST_QUERY } from "../../sanity/queries";

export const GET: APIRoute = async ({ url }) => {
  const { stateSlug, service } = parseDirectorySearchParams(url.searchParams);

  const contacts = await sanityClient.fetch(DIRECTORY_CONTACTS_LIST_QUERY, {
    stateSlug,
    service,
  });

  return Response.json({ contacts });
};
