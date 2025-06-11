import {
  withThemeByClassName,
  withThemeByDataAttribute,
} from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
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
    darkMode: {
      classTarget: "html",
      darkClass: "dark",
      stylePreview: true,
    },
  },
  decorators: [
    withThemeByDataAttribute({
      attributeName: "data-color",
      themes: {
        rainbow: "rainbow",
        pink: "pink",
        red: "red",
        orange: "orange",
        yellow: "yellow",
        green: "green",
        turquoise: "turquoise",
        indigo: "indigo",
        violet: "violet",
      },
      defaultTheme: "rainbow",
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
