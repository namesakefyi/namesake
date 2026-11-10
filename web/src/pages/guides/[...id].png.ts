import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = await getCollection("guides");
  return guides.map((guide: CollectionEntry<"guides">) => ({
    params: { id: guide.id },
  }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return new Response("Not found", { status: 404 });

  const guides = await getCollection("guides");
  const guide = guides.find((g: CollectionEntry<"guides">) => g.id === id);
  if (!guide) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Name Change Guide",
    title: guide.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
};
