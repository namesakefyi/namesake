import { type CollectionEntry, getCollection } from "astro:content";
import { siteInfo } from "#constants/site-info";

const roleRank = (role: string) => {
  if (/founder/i.test(role)) return 0;
  if (role === "Executive Director") return 1;
  if (/director/i.test(role)) return 2;
  return 3;
};

const compareByRole = (
  a: CollectionEntry<"authors">,
  b: CollectionEntry<"authors">,
) =>
  roleRank(a.data.org.role) - roleRank(b.data.org.role) ||
  a.data.org.role.localeCompare(b.data.org.role) ||
  a.data.name.localeCompare(b.data.name);

export const getNamesakeAuthors = async () => {
  const authors = await getCollection(
    "authors",
    ({ data }) => data.org.name === siteInfo.name,
  );
  return authors.sort(compareByRole);
};
