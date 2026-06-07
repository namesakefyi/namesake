import { getEntry } from "astro:content";
import type { APIRoute } from "astro";
import { createOgImageResponse } from "../../utils/createOgImageResponse";

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const post = await getEntry("posts", slug);
  if (!post) return new Response("Not found", { status: 404 });

  return await createOgImageResponse({
    subhead: "Blog",
    title: post.data.title,
    color: "blue",
    origin: new URL(request.url).origin,
  });
};
