import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import {
  defineConfig,
  fontProviders,
  passthroughImageService,
} from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    cloudflareModules: false,
    imageService: "compile",
  }),
  image: {
    service: passthroughImageService(),
  },
  site: "https://namesake.fyi",
  integrations: [
    sitemap(),
    mdx(),
    sanity({
      projectId: "k4p1j15y",
      dataset: "production",
      useCdn: true,
      studioBasePath: "/studio",
      apiVersion: "2025-09-19",
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
  experimental: {
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
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
  vite: {
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
