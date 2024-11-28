import type { Meta, StoryObj } from "@storybook/react";

import { RichText } from "./RichText";

const meta = {
  component: RichText,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RichText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialContent: "hello",
  },
};
