import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "./Logo";

const meta = {
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
