import { type CollectionEntry, getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts")).filter(
    (post: CollectionEntry<"posts">) => post.data.publishDate <= new Date(),
  );

  const items: RSSFeedItem[] = posts.map((post: CollectionEntry<"posts">) => ({
    title: post.data.title,
    pubDate: post.data.publishDate,
    description: post.data.description,
    link: `/blog/${post.id}`,
  }));

  return await rss({
    title: "Namesake",
    description: "News and updates from Namesake Collaborative.",
    site: context.site ?? "https://namesake.fyi",
    trailingSlash: false,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    items,
  });
}
