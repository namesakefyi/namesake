import type { Meta, StoryObj } from "@storybook/react";
import { CircleHelp } from "lucide-react";
import { Empty } from "./Empty";

const meta = {
  component: Empty,
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: CircleHelp,
    title: "Page not found",
  },
};

export const Subtitle: Story = {
  args: {
    icon: CircleHelp,
    title: "Page not found",
    subtitle: "We couldn't find that page.",
  },
};

export const Button: Story = {
  args: {
    icon: CircleHelp,
    title: "Page not found",
    subtitle: "We couldn't find that page.",
    button: {
      children: "Return home",
    },
  },
};
