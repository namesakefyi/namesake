import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const forms = await getCollection("forms");
  return forms.map((form: CollectionEntry<"forms">) => ({
    params: { slug: form.id },
  }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const form = await getEntry("forms", slug);
  if (!form) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Name Change Form",
    title: form.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
};
