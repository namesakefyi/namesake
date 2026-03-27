import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "k4p1j15y",
    dataset: "production",
  },
  deployment: {
    appId: "z6o4lwn6d4nk10velhthn6ef",
  },
  studioHost: "namesake",
  server: {
    hostname: "localhost",
    // Avoid clashing with Astro dev server (default 4321)
    port: 3333,
  },
  schemaExtraction: {
    enabled: true,
    enforceRequiredFields: true,
  },
  typegen: {
    enabled: true,
    path: "./src/sanity/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "./src/sanity/sanity.types.ts",
    overloadClientMethods: true,
  },
});
