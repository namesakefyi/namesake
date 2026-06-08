import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { isFormSlug } from "../../constants/forms";
import { createOgImageResponse } from "../../utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = async () => {
  const forms = await getCollection("forms");
  return forms
    .filter((f) => isFormSlug(f.id))
    .map((form) => ({ params: { slug: form.id } }));
};

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const forms = await getCollection("forms");
  const form = forms.find((f) => f.id === slug);
  if (!form) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Name Change Form",
    title: form.data.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
};
