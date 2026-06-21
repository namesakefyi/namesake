import type { APIRoute } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const GET: APIRoute = async ({ request }) => {
  return await createOgImageResponse({
    subhead: "Need more name change support? These organizations can help.",
    title: "Directory",
    color: "pink",
    origin: new URL(request.url).origin,
  });
};
