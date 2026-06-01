import { sanityClient } from "sanity:client";
import type { APIRoute } from "astro";
import { POST_BY_SLUG_QUERY } from "../../sanity/queries";
import { createOgImageResponse } from "../../utils/createOgImageResponse";

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Blog",
    title: post.title,
    color: "blue",
    origin: new URL(request.url).origin,
    ctx: locals.cfContext,
  });
};
