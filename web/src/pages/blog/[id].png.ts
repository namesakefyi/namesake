import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  return posts.map((post: CollectionEntry<"posts">) => ({
    params: { id: post.id },
  }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return new Response("Not found", { status: 404 });

  const post = await getEntry("posts", id);
  if (!post) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Blog",
    title: post.data.title,
    color: "blue",
    origin: new URL(request.url).origin,
  });
};
