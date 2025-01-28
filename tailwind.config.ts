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
    tailwindcssRadixColors({
      exclude: ["mauve", "sage", "olive", "sand"],
      aliases: {
        slate: "gray",
      },
    }),
    tailwindcssContainerQueries,
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.2s ease-in 0.2s both",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
} satisfies Config;
