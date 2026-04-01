# Namesake

![trans rights](https://pride-badges.pony.workers.dev/static/v1?label=Trans%20Rights&stripeWidth=6&stripeColors=5BCEFA,F5A9B8,FFFFFF,F5A9B8,5BCEFA) [![Chat](https://img.shields.io/discord/1250552190402035835?color=5865F2&logo=discord&logoColor=white)](https://namesake.fyi/chat) [![Accessibility](https://github.com/namesakefyi/namesake/actions/workflows/accessibility.yml/badge.svg)](https://github.com/namesakefyi/namesake/actions/workflows/accessibility.yml) [![Valid Links](https://github.com/namesakefyi/namesake/actions/workflows/links.yml/badge.svg)](https://github.com/namesakefyi/namesake/actions/workflows/links.yml) [![Storybook](https://github.com/namesakefyi/namesake/actions/workflows/storybook.yml/badge.svg)](https://storybook.namesake.fyi)

This repository contains the source code for the [namesake.fyi](https://namesake.fyi) website and blog, built with [Astro](https://astro.build) with content managed via [Sanity](https://www.sanity.io/) and hosted via [Cloudflare](https://cloudflare.com).

> [!NOTE]
> If you need help with your legal name change or gender marker change, come join us in [Discord](https://namesake.fyi/chat)!

## Directory Structure

| Location         | Description                                                             |
| :--------------- | :---------------------------------------------------------------------- |
| `e2e`            | End-to-end tests written using Playwright.                              |
| `public`         | Images, fonts, favicons, and app icons.                                 |
| `src/components` | All of the .astro components that are used and reused across the site.  |
| `src/constants`  | Shared data for site info and colors.                                   |
| `src/forms`      | Utilities and hooks for help managing form state and data.              |
| `src/layouts`    | Shared layout files for wrapping pages.                                 |
| `src/pages`      | Page-based routing for everything on the site.                          |
| `src/pdfs`       | All PDF forms along with their schema definitions and tests.            |
| `src/sanity`     | Schemas and components used for Sanity, our CMS.                        |
| `src/styles`     | Global site styles.                                                     |
| `src/utils`      | Helper functions and other utilities.                                   |

## Accessibility

Namesake aims to conform to the Level AA accessibility standards outlined in the [WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/). If you experience an issue with accessing any part of this site, please [file an issue](https://github.com/namesakefyi/namesake/issues) and we will correct it.

## Contributors

We 💖 our contributors! Namesake is built by, and for, the trans community, and we welcome contributors of all genders and skill levels.

😌 Keep Namesake safe for everyone by reviewing our [code of conduct](https://github.com/namesakefyi/namesake?tab=coc-ov-file).   
📖 Read our [contribution guide](/CONTRIBUTING.md) to learn how to set up your local environment and more.  
👋 Come [chat with us](https://namesake.fyi/chat) on Discord!
