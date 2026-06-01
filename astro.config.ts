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
  server: {
    host: true,
  },
  vite: {
    ssr: {
      external: ["@takumi-rs/core"],
      optimizeDeps: {
        exclude: ["astro-portabletext"],
      },
    },
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(browserslist("defaults")),
      },
    },
    // Re-enable this after Astro supports Vite v8
    // https://github.com/vitejs/vite/issues/21293
    // build: {
    //   cssMinify: "lightningcss",
    // },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("/src/constants/") &&
              !id.includes("/src/constants/forms")
            ) {
              return "shared-constants";
            }
            if (id.includes("/src/utils/")) {
              return "shared-utils";
            }
          },
        },
      },
    },
  },
});
