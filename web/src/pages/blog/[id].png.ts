import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("posts");
  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute<{ entry: CollectionEntry<"posts"> }> = async ({
  props,
  request,
}) =>
  createOgImageResponse({
    subhead: "Blog",
    title: props.entry.data.title,
    color: "blue",
    origin: new URL(request.url).origin,
  });
