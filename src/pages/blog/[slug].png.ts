export const prerender = true;

import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "../../utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

export const GET: APIRoute = async ({ props, request }) => {
  const { post } = props as { post: CollectionEntry<"posts"> };

  return await createOgImageResponse({
    subhead: "Blog",
    title: post.data.title,
    color: "blue",
    origin: new URL(request.url).origin,
  });
};
