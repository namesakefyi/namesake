import type { APIRoute } from "astro";
import { parseDirectorySearchParams } from "../../components/directory/DirectoryList/DirectoryList";
import { getDirectoryContacts } from "../../utils/getDirectoryContacts";

export const GET: APIRoute = async ({ url }) => {
  const filters = parseDirectorySearchParams(url.searchParams);
  const { contacts } = await getDirectoryContacts(filters);
  return Response.json({ contacts });
};
