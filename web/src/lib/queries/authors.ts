import { getCollection } from "astro:content";
import { siteInfo } from "#constants/site-info";

export const getNamesakeAuthors = () =>
  getCollection("authors", ({ data }) => data.org.name === siteInfo.name);
