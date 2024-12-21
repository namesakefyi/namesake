import type { Meta } from "@storybook/react";
import { PasswordStrength } from ".";

const meta: Meta<typeof PasswordStrength> = {
  component: PasswordStrength,
  argTypes: {
    value: {
      options: [0, 1, 2, 3, 4],
      control: { type: "radio" },
    },
  },
};

export default meta;

export const VeryWeak = (args: any) => <PasswordStrength {...args} />;

VeryWeak.args = {
  value: 0,
  warning: "This is a top-10 common password.",
  suggestions: ["Add another word or two"],
};

export const Weak = (args: any) => <PasswordStrength {...args} />;

Weak.args = {
  value: 1,
};

export const Okay = (args: any) => <PasswordStrength {...args} />;

Okay.args = {
  value: 2,
};

export const Good = (args: any) => <PasswordStrength {...args} />;

Good.args = {
  value: 3,
};

export const Great = (args: any) => <PasswordStrength {...args} />;

Great.args = {
  value: 4,
};
