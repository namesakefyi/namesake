import type { Meta, StoryObj } from "@storybook/react";

import { RichTextEditor } from "./RichTextEditor";

const meta = {
  component: RichTextEditor,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    markdown: "hello",
  },
};
