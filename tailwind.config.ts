import tailwindcssTypography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssAriaAttributes from "tailwindcss-aria-attributes";
import tailwindcssRadixColors from "tailwindcss-radix-colors";
import tailwindcssReactAriaComponents from "tailwindcss-react-aria-components";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "selector",
  plugins: [
    tailwindcssReactAriaComponents,
    tailwindcssAnimate,
    tailwindcssAriaAttributes,
    tailwindcssRadixColors,
    tailwindcssTypography,
  ],
} satisfies Config;
