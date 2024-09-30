import type { Meta, StoryObj } from "@storybook/react";

import { QuestStep } from "./QuestStep";

const meta = {
  component: QuestStep,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof QuestStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Get started",
    description: "This is the first step in the quest.",
  },
};
