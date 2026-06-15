import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = await getCollection("guides");
  return guides.map((guide: CollectionEntry<"guides">) => ({
    params: { slug: guide.id },
  }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const guides = await getCollection("guides");
  const guide = guides.find((g: CollectionEntry<"guides">) => g.id === slug);
  if (!guide) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Name Change Guide",
    title: guide.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
};
