import type { APIRoute } from "astro";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const GET: APIRoute = async ({ request }) => {
  return await createOgImageResponse({
    subhead:
      "Namesake's guided forms can help you fill out all the name change documents you need to file.",
    title: "Forms",
    color: "white",
    origin: new URL(request.url).origin,
  });
};
