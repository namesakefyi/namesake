import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("forms");
  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute<{ entry: CollectionEntry<"forms"> }> = async ({
  props,
  request,
}) =>
  createOgImageResponse({
    subhead: "Name Change Form",
    title: props.entry.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
