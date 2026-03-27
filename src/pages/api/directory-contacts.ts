import type { APIRoute } from "astro";
import type { DirectoryContact } from "@/directory/directoryContact";
import { DIRECTORY_CONTACTS_LIST_GROQ } from "@/directory/directoryContactsQuery";
import { parseDirectorySearchParams } from "@/directory/parseDirectorySearchParams";
import { loadQuery } from "@/sanity/lib/loadQuery";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const { selectedStateSlug, selectedService } = parseDirectorySearchParams(
    url.searchParams,
  );

  const { data: contacts } = await loadQuery<DirectoryContact[]>({
    query: DIRECTORY_CONTACTS_LIST_GROQ,
    params: {
      stateSlug: selectedStateSlug,
      service: selectedService,
    },
  });

  return Response.json({ contacts });
};
