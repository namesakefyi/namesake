import type { Meta, StoryObj } from "@storybook/react";
import { Check, Clock, Star } from "lucide-react";
import { Label } from "./Label";

const meta = {
  title: "Common/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCheck: Story = {
  args: {
    icon: Check,
    children: "Completed task",
  },
};

export const WithClock: Story = {
  args: {
    icon: Clock,
    children: "Time remaining: 2 days",
  },
};

export const WithStar: Story = {
  args: {
    icon: Star,
    children: "Featured content",
  },
};
