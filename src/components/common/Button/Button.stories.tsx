import { Button } from "@/components/common";

export default {
  component: Button,

  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "destructive"],
    },
  },
  args: {
    isDisabled: false,
    children: "Button",
  },
};

export const Primary = {
  args: {
    variant: "primary",
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
  },
};

export const Destructive = {
  args: {
    variant: "destructive",
  },
};
