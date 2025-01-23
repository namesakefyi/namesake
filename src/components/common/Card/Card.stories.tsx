import { Card } from "@/components/common";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};
