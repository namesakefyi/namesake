import cloudflare from "@astrojs/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import {
  defineConfig,
  fontProviders,
  passthroughImageService,
} from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { remarkModifiedTime } from "./scripts/remark-modified-time.mjs";

export default defineConfig({
  site: "https://namesake.fyi",
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    sitemap(),
    mdx({
      processor: unified({
        remarkPlugins: [remarkModifiedTime],
      }),
    }),
    react(),
  ],
  prefetch: true,
  trailingSlash: "never",
  build: {
    // Eliminate trailing slashes from Cloudflare Pages
    // https://creativehike.com/posts/removing-trailng-slashes-astro
    format: "file",
  },
  redirects: {
    // Use new nested routes for state guides
    "/guides/birth-certificate-ma": "/guides/ma/birth-certificate",
    "/guides/court-order-ma": "/guides/ma/court-order",
    "/guides/state-id-ma": "/guides/ma/state-id",
    "/guides/court-order-ri": "/guides/ri/court-order",
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Atkinson Hyperlegible Soft",
      cssVariable: "--font-sans",
      fallbacks: ["Helvetica", "Arial", "sans-serif"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/fonts/AtkinsonHyperlegibleSoft-Regular.woff2"],
          },
          {
            weight: 400,
            style: "italic",
            src: ["./src/fonts/AtkinsonHyperlegibleSoft-RegularItalic.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/fonts/AtkinsonHyperlegibleSoft-Bold.woff2"],
          },
          {
            weight: 700,
            style: "italic",
            src: ["./src/fonts/AtkinsonHyperlegibleSoft-BoldItalic.woff2"],
          },
        ],
      },
    },
  ],
  devToolbar: {
    enabled: false,
  },
  session: {
    driver: {
      entrypoint: "unstorage/drivers/null",
    },
  },
  server: {
    host: true,
    open: true,
  },
  vite: {
    assetsInclude: ["**/*.wasm"],
    ssr: {
      external: ["node:buffer", "node:path", "node:fs"],
    },
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(browserslist("defaults")),
      },
    },
    build: {
      cssMinify: "lightningcss",
    },
  },
});
