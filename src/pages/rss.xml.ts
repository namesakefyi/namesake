import { sanityClient } from "sanity:client";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import sanitizeHtml from "sanitize-html";
import { RSS_POSTS_QUERY } from "../sanity/queries";

export async function GET(context: APIContext) {
  const posts = await sanityClient.fetch(RSS_POSTS_QUERY);

  const items: RSSFeedItem[] = posts.map((post) => ({
    title: post.title ?? undefined,
    pubDate: post.publishDate ? new Date(post.publishDate) : undefined,
    description: post.description ?? undefined,
    link: post.slug?.current ? `/blog/${post.slug.current}` : undefined,
    content: sanitizeHtml(post.contentText || post.description || ""),
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
