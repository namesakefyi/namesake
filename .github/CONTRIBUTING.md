# Contributor Manual

## Getting Started

Namesake uses pnpm for package management. You may need to [install pnpm](https://pnpm.io/installation) globally if you don't have it installed.

### Setting up your local repo

```shell
git clone https://github.com/namesakefyi/namesake.git
cd namesake
```

Once you are within the directory for the repo, install packages:

```shell
pnpm install
```

And start up the dev server:

```shell
pnpm dev
```

The `dev` command will spin up the convex backend and the app's frontend in parallel. To run them individually, run `pnpm dev:frontend` or `pnpm dev:backend`.

## Dependencies

It's worth getting familiar with the Namesake app's core dependencies:

| Tech                                                                                | What For                                           |
| ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Convex](https://docs.convex.dev/)                                                  | Type-safe database, file storage, realtime updates |
| [Convex Auth](https://labs.convex.dev/auth)                                         | User authentication                                |
| [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview) | File-based routing                                 |
| [React](https://react.dev/reference/react)                                          | Front-end web framework                            |
| [React Aria](https://react-spectrum.adobe.com/react-aria)                           | Accessible components and design system            |
| [Tailwind](https://tailwindcss.com/docs)                                            | Utility-first styling                              |
| [Remix Icon](https://remixicon.com/)                                                | SVG icons                                          |
| [Radix Colors](https://www.radix-ui.com/colors)                                     | Accessible color palette                           |
| [Resend](https://resend.com/docs)                                                   | Email sending                                      |
| [Vitest](https://vitest.dev/guide/)                                                 | Unit testing                                       |
| [Playwright](https://playwright.dev/docs)                                           | End-to-end testing                                 |
| [Biome](https://biomejs.dev/)                                                       | Formatting and linting                             |

View all dependencies in [package.json](/package.json).

## Project Structure

```shell
📂 convex          # Backend queries, mutations, and schema definitions
📂 public          # Images, favicons, and other unprocessed assets
📂 src             # Frontend application
├── 📂 components  # Shared components
├── 📂 routes      # File-based routing using TanStack Router
├── 📂 styles      # Global CSS (not much here, most of it's in Tailwind!)
└── main.tsx       # Base of the project including common Providers
📂 src             # End-to-end Playwright tests
```
