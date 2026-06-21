import type { APIRoute } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const GET: APIRoute = async ({ request }) => {
  return await createOgImageResponse({
    subhead: "Step-by-step name change guides for identity documents.",
    title: "Guides",
    color: "white",
    origin: new URL(request.url).origin,
  });
};
