import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { parseDirectorySearchParams } from "../../components/directory/DirectoryList/DirectoryList";
import type { DirectoryContact } from "../../components/directory/DirectoryList/DirectoryListItem";

export const GET: APIRoute = async ({ url }) => {
  const { stateSlug, service } = parseDirectorySearchParams(url.searchParams);

  const [statesCollection, contactEntries] = await Promise.all([
    getCollection("states"),
    getCollection("contacts"),
  ]);

  const stateNameById = Object.fromEntries(
    statesCollection.map(({ id, data }) => [id, data.name]),
  );

  const filtered = contactEntries.filter((entry) => {
    if (stateSlug && !entry.data.states.includes(stateSlug)) return false;
    if (service && !entry.data.services.includes(service)) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (a.data.officialPartner !== b.data.officialPartner)
      return a.data.officialPartner ? -1 : 1;
    return a.data.name.localeCompare(b.data.name);
  });

  const contacts: DirectoryContact[] = await Promise.all(
    filtered.map(async ({ id, data }) => {
      const logoUrl = data.logo
        ? (await getImage({ src: data.logo })).src
        : null;
      return {
        slug: id,
        name: data.name,
        description: data.description,
        states: data.states.map((s) => stateNameById[s] ?? s).sort(),
        services: data.services,
        officialPartner: data.officialPartner,
        email: data.email ?? null,
        phone: data.phone ?? null,
        url: data.url,
        logoUrl,
      };
    }),
  );

  return Response.json({ contacts });
};
