import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import type { DirectoryContact } from "../components/directory/DirectoryList/DirectoryListItem";

export async function getDirectoryContacts(filters: {
  stateSlug: string;
  service: string;
}): Promise<{
  contacts: DirectoryContact[];
  allStates: { id: string; name: string }[];
}> {
  const [statesCollection, contactEntries] = await Promise.all([
    getCollection("states"),
    getCollection("contacts"),
  ]);

  const stateNameById = Object.fromEntries(
    statesCollection.map(({ id, data }) => [id, data.name]),
  );

  const allStates = statesCollection
    .map(({ id, data }) => ({ id, name: data.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filtered = contactEntries.filter((entry) => {
    if (
      filters.stateSlug &&
      !entry.data.states.some((ref) => ref.id === filters.stateSlug)
    )
      return false;
    if (filters.service && !entry.data.services.includes(filters.service))
      return false;
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
        states: data.states
          .map((ref) => stateNameById[ref.id] ?? ref.id)
          .sort(),
        services: data.services,
        officialPartner: data.officialPartner,
        email: data.email ?? null,
        phone: data.phone ?? null,
        url: data.url,
        logoUrl,
      };
    }),
  );

  return { contacts, allStates };
}
