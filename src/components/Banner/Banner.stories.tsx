import type { Meta, StoryObj } from "@storybook/react";

import { Banner } from "./Banner";

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

export const Info: Story = {
  args: {
    children: "Here's some handy information",
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    children: "Something successful happened",
    variant: "success",
  },
};

export const Danger: Story = {
  args: {
    children: "Something went wrong",
    variant: "danger",
  },
};

export const Warning: Story = {
  args: {
    children: "Be careful!",
    variant: "warning",
  },
};
