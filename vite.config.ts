import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss(), cssnano()],
    },
  },
});
