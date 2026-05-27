#!/usr/bin/env node

import { exec } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

function openBrowser(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

async function main() {
  const server = await createServer({
    configFile: join(__dirname, "vite.config.mjs"),
  });
  await server.listen();

  const { port } = server.config.server;
  const url = `http://localhost:${port}`;
  server.printUrls();
  openBrowser(url);

  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
