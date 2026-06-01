import { createElement } from "react";
import { ImageResponse } from "takumi-js/response";
import { OgImage } from "../components/OgImage";
import type { NamesakeColor } from "../constants/colors";

type OgImageOptions = {
  subhead: string;
  title: string;
  color?: Exclude<NamesakeColor, "black">;
  origin: string;
};

export function createOgImageResponse({
  subhead,
  title,
  color,
  origin,
}: OgImageOptions) {
  return new ImageResponse(createElement(OgImage, { subhead, title, color }), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Atkinson Hyperlegible Soft",
        weight: 400,
        data: () =>
          fetch(`${origin}/fonts/AtkinsonHyperlegibleSoft-Regular.woff2`).then(
            (res) => res.arrayBuffer(),
          ),
      },
      {
        name: "Atkinson Hyperlegible Soft",
        weight: 700,
        data: () =>
          fetch(`${origin}/fonts/AtkinsonHyperlegibleSoft-Bold.woff2`).then(
            (res) => res.arrayBuffer(),
          ),
      },
    ],
    persistentImages: [
      {
        src: "logo",
        data: () =>
          fetch(`${origin}/site/brand-assets/namesake-wordmark.svg`).then(
            (res) => res.arrayBuffer(),
          ),
      },
      {
        src: "speckles",
        data: () =>
          fetch(`${origin}/site/speckles-black.svg`).then((res) =>
            res.arrayBuffer(),
          ),
      },
    ],
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
