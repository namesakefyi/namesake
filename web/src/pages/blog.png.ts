import type { APIRoute } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const GET: APIRoute = async ({ request }) => {
  return await createOgImageResponse({
    subhead: "The latest news from Namesake.",
    title: "Blog",
    color: "blue",
    origin: new URL(request.url).origin,
  });
};
