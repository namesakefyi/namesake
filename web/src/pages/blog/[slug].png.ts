import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  return posts.map((post: CollectionEntry<"posts">) => ({
    params: { slug: post.id },
  }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const posts = await getCollection("posts");
  const post = posts.find(
    (p: CollectionEntry<"posts">) => p.id === params.slug,
  );
  if (!post) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Blog",
    title: post.data.title,
    color: "blue",
    origin: new URL(request.url).origin,
  });
};
