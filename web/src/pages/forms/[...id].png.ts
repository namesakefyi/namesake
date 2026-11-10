import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const forms = await getCollection("forms");
  return forms.map((form: CollectionEntry<"forms">) => ({
    params: { id: form.id },
  }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return new Response("Not found", { status: 404 });

  const form = await getEntry("forms", id);
  if (!form) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Name Change Form",
    title: form.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
};
