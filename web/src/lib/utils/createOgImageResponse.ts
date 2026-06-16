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
