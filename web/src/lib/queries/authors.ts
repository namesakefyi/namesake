import { getCollection } from "astro:content";
import { siteInfo } from "#constants/site-info";

export const getNamesakeAuthors = async () => {
  const authors = await getCollection(
    "authors",
    ({ data }) => data.org.name === siteInfo.name,
  );
  return authors;
};
