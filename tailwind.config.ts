import tailwindcssContainerQueries from "@tailwindcss/container-queries";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssAriaAttributes from "tailwindcss-aria-attributes";
import tailwindcssRadixColors from "tailwindcss-radix-colors";
import tailwindcssReactAriaComponents from "tailwindcss-react-aria-components";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  plugins: [
    tailwindcssReactAriaComponents,
    tailwindcssAnimate,
    tailwindcssAriaAttributes,
    tailwindcssRadixColors,
    tailwindcssContainerQueries,
  ],
} satisfies Config;
