import { GoogleFont, ImageResponse } from "cf-workers-og";
import { createElement } from "react";
import { OgImage } from "#components/OgImage";
import type { NamesakeColor } from "#constants/colors";

type OgImageOptions = {
  subhead: string;
  title: string;
  color?: Exclude<NamesakeColor, "black">;
  origin: string;
};

/**
 * Given a subhead, title, and color, return a rendered PNG Open Graph
 * image response for social sharing previews.
 *
 * @example
 * await createOgImageResponse({
 *   subhead: "Massachusetts",
 *   title: "Plan your name change",
 *   origin: "https://namesake.fyi",
 * })
 * // ImageResponse (PNG, 1200x630)
 */
export async function createOgImageResponse({
  subhead,
  title,
  color,
  origin,
}: OgImageOptions) {
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
