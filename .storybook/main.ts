import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const excludedProps = new Set([
  "id",
  "slot",
  "onCopy",
  "onCut",
  "onPaste",
  "onCompositionStart",
  "onCompositionEnd",
  "onCompositionUpdate",
  "onSelect",
  "onBeforeInput",
  "onInput",
]);

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  stories: ["../src/components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-themes",
    "@storybook/addon-links",
    "@vueless/storybook-dark-mode",
  ],
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) =>
        !prop.name.startsWith("aria-") && !excludedProps.has(prop.name),
    },
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve?.alias,
        "~": path.resolve(__dirname, "src"),
      };
    }
    return config;
  },
};

export default config;
