# Contributor Manual

Welcome! Thank you for your interest in contributing to the Namesake app. We're glad you are here!

Our aim is for contributing to Namesake to be easy and understandable. If you run into trouble at any step of the process, reach out on [Discord](https://namesake.fyi/chat).

## How contributions work

There are a few steps in the contribution process.

First time only:

1. **Fork the repository.**
2. **Clone the forked repository to your machine.**
3. **Install pnpm.**

Every time:

1. **Make your changes.** This is the fun part!
2. **Push changes to GitHub.**
3. **Open a pull request against this repository.**
4. **Wait for review, merge, and release!**

## Getting Started

### Install pnpm

Namesake uses pnpm for package management. You may need to [install pnpm](https://pnpm.io/installation) globally if you don't have it installed.

### Clone the repository

In your terminal, run the following:

```shell
git clone https://github.com/namesakefyi/namesake.git
cd namesake
```

### Install packages

```shell
pnpm install
```

### Connect to Convex (first time only)

The first time you set up the app, you will need to connect to Convex. Run:

```shell
npx convex dev
```

Select "choose an existing project" and affirm "configure project namesake".

Convex will generate an `.env.local` file which points to a dev database for you to use.

### Start the dev server

To start developing locally, run:

```shell
pnpm dev
```

The app will be available at http://localhost:5173.

> [!NOTE]
> The `dev` command will spin up the convex backend and the app's frontend in parallel. To run them individually, run `pnpm dev:frontend` or `pnpm dev:backend`.

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
📂 e2e             # End-to-end Playwright tests
📂 public          # Images, favicons, and other unprocessed assets
📂 src             # Frontend application
├── 📂 components  # Shared components
├── 📂 routes      # File-based routing using TanStack Router
├── 📂 styles      # Global CSS (not much here, most of it's in Tailwind!)
└── main.tsx       # Base of the project including common Providers
```
