/// <reference path="../.astro/types.d.ts" />
/// <reference path="./sanity/sanity.types.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
