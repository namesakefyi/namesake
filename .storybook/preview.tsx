import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";

import "../src/styles/index.css";
import React from "react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  decorators: [
    withThemeByClassName({
      parentSelector: "html",
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => {
      const form = useForm();

      return (
        <FormProvider {...form}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export default preview;
