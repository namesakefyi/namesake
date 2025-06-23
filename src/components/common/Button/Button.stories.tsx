import { ArrowRight, Plus } from "lucide-react";
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

export const LeadingIcon = {
  args: {
    variant: "primary",
    icon: Plus,
    children: "Create new",
  },
};

export const TrailingIcon = {
  args: {
    variant: "primary",
    endIcon: ArrowRight,
    children: "Next step",
  },
};

export const BothIcons = {
  args: {
    variant: "secondary",
    icon: Plus,
    endIcon: ArrowRight,
    children: "Add and continue",
  },
};
