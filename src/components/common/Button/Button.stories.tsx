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
    isSubmitting: false,
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

export const Submitting = {
  args: {
    variant: "primary",
    isSubmitting: true,
    children: "Saving...",
  },
};

export const Disabled = {
  args: {
    variant: "primary",
    isDisabled: true,
    children: "Cannot click",
  },
};
