import { Badge, BadgeButton } from "@/components/common";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";

const meta = {
  component: Badge,
  argTypes: {
    size: {
      options: ["xs", "sm", "lg"],
      control: { type: "radio" },
    },
    variant: {
      options: ["default", "warning", "danger", "success"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const WithIcon: Story = {
  args: {
    children: "With Icon",
    icon: Info,
  },
};

export const WithButton = (args: any) => (
  <Badge {...args}>
    {args.children}
    <BadgeButton label="More info" icon={Info} />
  </Badge>
);

WithButton.args = {
  children: "With Button",
};
