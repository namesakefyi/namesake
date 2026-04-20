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

## Making changes

### Start the dev server

To start developing locally, run:

```shell
pnpm dev
```

The app should now be available at http://localhost:4321. You're all set up!

## Formatting code

Code formatting and linting is handled with [Biome](https://biomejs.dev/). If you use VS Code to make edits, Biome should automatically format your files on save, according to [.vscode/settings.json](https://github.com/namesakefyi/namesake/blob/main/.vscode/settings.json). The first time you open the Namesake repository in VS Code, it may prompt you to install the Biome extension.

In addition, each time you `git commit` changes to the codebase, a pre-commit hook will run to check and format your code according to our Biome rules. This check helps prevent any poorly-formatted code from entering the codebase. If Biome throws an error when you try to commit your code, fix the error, `add` your changes, and `commit` again. You can re-use your original commit message—since the commit failed, the original message was discarded.

## Adding new PDFs

See the [README](https://github.com/namesakefyi/namesake/blob/main/src/pdfs/README.md).

## Creating pull requests

1. **Keep changes small.** If you're tackling multiple issues, split them up into multiple pull requests. Smaller chunks of code are easier to review and test!
2. **Explain what you did, why, and how.** "The better we present our code for review, the more likely the reviewer will be engaged with a critical eye." — [Writing a Great Pull Request Description](https://www.hackerone.com/blog/writing-great-pull-request-description)

## Releasing

PRs which merge to `main` will be automatically deployed via Cloudflare.
