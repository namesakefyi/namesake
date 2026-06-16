import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

// Get all entries from the `docs` content collection.
const entries = await getCollection("docs");

// Map the entry array to an object with the page ID as key and the
// frontmatter data as value.
const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

export const { getStaticPaths, GET } = await OGImageRoute({
  // Pass down the documentation pages.
  pages,
  // Define the name of the parameter used in the endpoint path, here `slug`
  // as the file is named `[...slug].ts`.
  param: "slug",
  // Define a function called for each page to customize the generated image.
  getImageOptions: (_id, page: (typeof pages)[number]) => {
    return {
      // Use the page title and description as the image title and description.
      title: page.data.title,
      description: page.data.description,
      // Flexoki-style dark theme colours:
      // Background: near-black (#181818)
      bgGradient: [[24, 24, 27]],
      // Border: magenta accent (#8843b6) on the leading edge
      border: { color: [136, 67, 182], width: 20 },
      padding: 120,
      // Title in white, description in a muted grey
      font: {
        title: {
          color: [238, 238, 238],
          size: 70,
        },
        description: {
          color: [194, 194, 194],
          size: 40,
        },
      },
    };
  },
});
