import { sanityClient } from "sanity:client";
import type { APIRoute } from "astro";
import { FORM_BY_SLUG_QUERY } from "../../sanity/queries";
import { createOgImageResponse } from "../../utils/createOgImageResponse";

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const form = await sanityClient.fetch(FORM_BY_SLUG_QUERY, { slug });
  if (!form) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Name Change Form",
    title: form.title,
    color: "white",
    origin: new URL(request.url).origin,
    ctx: locals.cfContext,
  });
};
