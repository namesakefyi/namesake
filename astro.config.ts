import cloudflare from "@astrojs/cloudflare";
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

export default defineConfig({
  site: "https://namesake.fyi",
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  image: {
    service: passthroughImageService(),
  },
  integrations: [sitemap(), mdx(), react()],
  prefetch: true,
  trailingSlash: "never",
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
              (id.includes("/src/constants/") &&
                !id.includes("/src/constants/forms")) ||
              id.includes("/src/utils/")
            ) {
              return "shared";
            }
          },
        },
      },
    },
  },
});
