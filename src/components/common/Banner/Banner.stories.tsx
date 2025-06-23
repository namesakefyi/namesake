import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner } from "@/components/common";

const meta = {
  component: Banner,
  argTypes: {
    variant: {
      options: ["default", "warning", "danger", "success"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Basic information",
  },
};
