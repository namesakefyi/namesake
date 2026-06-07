export const prerender = true;

import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "../../utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  return posts.map((post: CollectionEntry<"posts">) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props, request }) => {
  const { post }: { post: CollectionEntry<"posts"> } = props;

  return await createOgImageResponse({
    subhead: "Blog",
    title: post.data.title,
    color: "blue",
    origin: new URL(request.url).origin,
  });
};
