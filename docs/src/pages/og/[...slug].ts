import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

// Implementation based on: https://hideoo.dev/notes/starlight-og-images
const entries = await getCollection("docs");

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_id, page: (typeof pages)[number]) => {
    return {
      title: page.data.title,
      description: page.data.description,
      bgGradient: [[225, 225, 225]],
      padding: 90,
      logo: {
        path: "./src/pages/og/_images/logo.svg",
      },
      fonts: [
        "./src/fonts/AtkinsonHyperlegibleSoft-Regular.ttf",
        "./src/fonts/AtkinsonHyperlegibleSoft-Bold.ttf",
      ],
      font: {
        title: {
          color: [17, 17, 17],
          size: 70,
          weight: "Bold",
          families: ["Atkinson Hyperlegible Soft", "Helvetica", "sans-serif"],
        },
        description: {
          color: [17, 17, 17],
          size: 40,
          weight: "Regular",
          families: ["Atkinson Hyperlegible Soft", "Helvetica", "sans-serif"],
        },
      },
    };
  },
});
