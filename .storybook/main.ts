import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes", "@storybook/addon-controls"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
