import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createApiPlugin } from "./lib/api";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [react(), createApiPlugin()],
  server: { port: 3456 },
  build: { outDir: join(__dirname, "dist") },
});
