import { Button } from ".";

export default {
  component: Button,
  parameters: {
    layout: "centered",
  },

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
