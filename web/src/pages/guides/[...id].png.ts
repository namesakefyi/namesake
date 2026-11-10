import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("guides");
  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute<{ entry: CollectionEntry<"guides"> }> = async ({
  props,
  request,
}) =>
  createOgImageResponse({
    subhead: "Name Change Guide",
    title: props.entry.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
