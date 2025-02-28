import type { Meta, StoryObj } from "@storybook/react";
import { RedactedText } from "./RedactedText";

const meta: Meta<typeof RedactedText> = {
  component: RedactedText,
};

export default meta;
type Story = StoryObj<typeof RedactedText>;

export const Default: Story = {
  args: {
    children: "This is a secret message",
  },
};

export const LongText: Story = {
  args: {
    children:
      "This is a much longer secret message that might need to wrap to multiple lines to demonstrate how the component handles longer content.",
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Custom styled secret",
    className: "text-xl font-bold",
  },
};

export const ShortText: Story = {
  args: {
    children: "Secret",
  },
};
