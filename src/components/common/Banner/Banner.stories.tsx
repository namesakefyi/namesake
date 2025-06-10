import { Banner } from "@/components/common";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Banner,
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Basic information",
  },
};
