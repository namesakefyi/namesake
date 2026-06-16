import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";
import starlightThemeFlexoki from "starlight-theme-flexoki";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.namesake.fyi",
  adapter: cloudflare(),
  session: {
    driver: {
      entrypoint: "unstorage/drivers/null",
    },
  },
  server: {
    port: 5432,
    open: true,
  },
  integrations: [
    mermaid({
      mermaidConfig: {
        layout: "elk",
      },
    }),
    starlight({
      title: "Namesake",
      description:
        "The Namesake Contributor Manual documents how to help Namesake build tools for legal name changes in the U.S.",
      plugins: [
        starlightThemeFlexoki({
          accentColor: "magenta",
        }),
      ],
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      sidebar: [
        {
          label: "Start Here",
          items: ["getting-started"],
        },
        {
          label: "Guides",
          items: ["guides/setup", "guides/new-pdfs", "guides/building-forms"],
        },
        {
          label: "Understanding",
          items: [{ autogenerate: { directory: "understanding" } }],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/namesakefyi/namesake/edit/main/docs/",
      },
      lastUpdated: true,
      titleDelimiter: "·",
      expressiveCode: {
        themes: ["github-dark-high-contrast", "github-light"],
      },
      social: [
        {
          icon: "discord",
          label: "Discord",
          href: "https://namesake.fyi/chat",
        },
        {
          icon: "blueSky",
          label: "Bluesky",
          href: "https://bsky.app/profile/namesake.fyi",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/namesakefyi",
        },
      ],
      customCss: ["./src/styles/theme.css"],
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
