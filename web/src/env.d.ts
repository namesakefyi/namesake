/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Geoapify API key enabling address autocomplete. Optional. */
  readonly PUBLIC_GEOAPIFY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
