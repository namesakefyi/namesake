# Contributor Manual

Welcome! Thank you for your interest in contributing to the Namesake app. We're glad you are here!

Our aim is for contributions to be easy and understandable. If you run into trouble at any step of the process, reach out on [Discord](https://namesake.fyi/chat).

## Getting started

There are many different ways to contribute to Namesake. You can share feedback in the [Discord](https://namesake.fyi), [report a bug or a feature request](https://github.com/namesakefyi/namesake/issues), or [submit your own code to the codebase](https://github.com/namesakefyi/namesake/pulls).

### Install pnpm (if needed, first time only)

Namesake uses pnpm for package management. You may need to [install pnpm](https://pnpm.io/installation) globally if you don't have it already.

### Fork the repository (first time only)

Unless you're a member of the [namesakefyi](https://github.com/namesakefyi) org, you won't be able to open a branch directly on the repo. To make changes, you have to fork a copy. Click the "Fork" button on the top right of the [main repository page](https://github.com/namesakefyi/namesake/).

### Clone the repository (first time only)

Once you've forked the repository, clone it to your computer. Replace `USERNAME` below with your GitHub username.

```shell
git clone https://github.com/USERNAME/namesake.git
cd namesake
pnpm install
```

### Connect to Convex (first time only)

The first time you set up the app, you'll need to connect to our backend service, [Convex](https://www.convex.dev/). Run:

```shell
npx convex dev
```

Convex will prompt you to create an account or a new project as necessary.

Convex will generate an `.env.local` file which points to a dev database for you to use.

> [!NOTE]
> If this is your first time using Convex, [follow the tour](https://docs.convex.dev/get-started) to understand how the system works and read [The Zen of Convex](https://docs.convex.dev/zen) to understand best practices.

## Making changes

### Start the dev server

To start developing locally, run:

```shell
pnpm dev
```

> [!NOTE]
> The `dev` command will spin up the convex backend and the app's frontend in parallel. To run them individually, run `pnpm dev:frontend` or `pnpm dev:backend`.

The app should now be available at http://localhost:5173. You're all set up!

Now that the development app is running, let's get familiar with what's inside.

## Project structure

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

## Dependencies

Below are Namesake's core dependencies. The links below each lead to docs.

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

## Formatting code

Code formatting and linting is handled with [Biome](https://biomejs.dev/). If you use VS Code to make edits, Biome should automatically format your files on save, according to [.vscode/settings.json](https://github.com/namesakefyi/namesake/blob/main/.vscode/settings.json). The first time you open the Namesake repository in VS Code, it may prompt you to install the Biome extension.

In addition, each time you `git commit` changes to the codebase, a pre-commit hook will run to check and format your code according to our Biome rules. This check helps prevent any poorly-formatted code from entering the codebase. If Biome throws an error when you try to commit your code, fix the error, `add` your changes, and `commit` again. You can re-use your original commit message—since the commit failed, the original message was discarded.

## Creating pull requests

1. **Keep changes small when possible.** If you're tackling multiple issues, split them up into multiple pull requests. Smaller chunks of code are easier to review and test!
2. **Explain what you did, why, and how.** Each pull request has a [pre-filled template](https://github.com/namesakefyi/namesake/blob/main/.github/pull_request_template.md?plain=1). Use it! "The better we present our code for review, the more likely the reviewer will be engaged with a critical eye." — [Writing a Great Pull Request Description](https://www.pullrequest.com/blog/writing-a-great-pull-request-description/)
3. **Add a changeset.** Namesake uses [changesets](https://github.com/changesets/changesets) to version releases. You can add a changeset by running `pnpm changeset` and selecting the appropriate options. `patch` is for bug fixes and tiny edits. `minor` is for small new features or designs. `major` is for large new features. If your PR changes multiple things (e.g. patches two bugs and adds one small feature), you can add multiple changesets. **Changesets should be written from a user perspective**—PRs which only affect developers (refactoring some tests, for example) do not need a changeset.
4. **Use [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) style titles.** This means prefixing your PR title with a word like `feat:`, `fix:`, `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, or `test:`. The title itself should start with a verb, like "add" or "update".
5. **Add or update tests.** The goal for Namesake is to have solid test coverage. When you open a PR, you'll see an automated comment that displays how test coverage has increased or decreased with your changes. _While Namesake is pre-version 1.0, our test coverage may be spotty and isn't the first priority. If you want to ignore this for now, it won't prevent you from merging._

## Releasing

Any PRs containing a changeset, once merged into `main` will generate or update an automated PR titled `ci: Release`. This PR contains updates to the changelog using the changesets from all the PRs that have merged since the last release. To release the latest version of Namesake, merge this `ci: Release` PR into `main` and a workflow will kickoff to update the release tag on the repo and deploy changes to production.
