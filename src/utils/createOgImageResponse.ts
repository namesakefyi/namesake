import { createElement } from "react";
import { GoogleFont, ImageResponse, cache } from "cf-workers-og";
import { OgImage } from "../components/OgImage";
import type { NamesakeColor } from "../constants/colors";

type OgImageOptions = {
  subhead: string;
  title: string;
  color?: Exclude<NamesakeColor, "black">;
  origin: string;
  ctx: { waitUntil(promise: Promise<unknown>): void };
};

export async function createOgImageResponse({
  subhead,
  title,
  color,
  origin,
  ctx,
}: OgImageOptions) {
  cache.setExecutionContext(ctx);

  return ImageResponse.create(
    createElement(OgImage, { subhead, title, color, origin }),
    {
      width: 1200,
      height: 630,
      fonts: [
        new GoogleFont("Atkinson Hyperlegible", { weight: 400 }),
        new GoogleFont("Atkinson Hyperlegible", { weight: 700 }),
      ],
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}
