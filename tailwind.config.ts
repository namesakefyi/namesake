import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        theme: {
          1: "var(--color-theme-1)",
          2: "var(--color-theme-2)",
          3: "var(--color-theme-3)",
          4: "var(--color-theme-4)",
          5: "var(--color-theme-5)",
          6: "var(--color-theme-6)",
          7: "var(--color-theme-7)",
          8: "var(--color-theme-8)",
          9: "var(--color-theme-9)",
          10: "var(--color-theme-10)",
          11: "var(--color-theme-11)",
          12: "var(--color-theme-12)",
          a1: "var(--color-theme-a1)",
          a2: "var(--color-theme-a2)",
          a3: "var(--color-theme-a3)",
          a4: "var(--color-theme-a4)",
          a5: "var(--color-theme-a5)",
          a6: "var(--color-theme-a6)",
          a7: "var(--color-theme-a7)",
          a8: "var(--color-theme-a8)",
          a9: "var(--color-theme-a9)",
          a10: "var(--color-theme-a10)",
          a11: "var(--color-theme-a11)",
          a12: "var(--color-theme-a12)",
        },
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 200%" },
        },
      },
      animation: {
        gradient: "gradient 8s linear infinite",
      },
    },
  },
} satisfies Config;
