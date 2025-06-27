import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@/components/common";

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
