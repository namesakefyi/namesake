import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

// Temporary fix for: https://github.com/withastro/astro/issues/15878
const isTest = process.env.VITEST === "true";

export default defineConfig({
  output: "server",
  // Disable Cloudflare adapter during tests: Vitest injects Node builtins into
  // resolve.external, which conflicts with @cloudflare/vite-plugin.
  // See: https://github.com/withastro/astro/issues/15878
  adapter: isTest
    ? undefined
    : cloudflare({
        imageService: "compile",
      }),
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
