import { type CollectionEntry, getCollection } from "astro:content";
import { siteInfo } from "#constants/site-info";

const roleRank = (role: string) => {
  if (/founder/i.test(role)) return 0;
  if (role === "Executive Director") return 1;
  if (/director/i.test(role)) return 2;
  return 3;
};

const compareByRole = (
  first: CollectionEntry<"authors">,
  second: CollectionEntry<"authors">,
) =>
  roleRank(first.data.org.role) - roleRank(second.data.org.role) ||
  first.data.org.role.localeCompare(second.data.org.role) ||
  first.data.name.localeCompare(second.data.name);

export const getNamesakeAuthors = async () => {
  const authors = await getCollection(
    "authors",
    ({ data }) => data.org.name === siteInfo.name,
  );
  return authors.sort(compareByRole);
};
