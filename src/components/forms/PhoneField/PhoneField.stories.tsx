import type { Meta } from "@storybook/react";
import { PhoneField, type PhoneFieldProps } from ".";

const meta: Meta<typeof PhoneField> = {
  component: PhoneField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: PhoneFieldProps) => <PhoneField {...args} />;

Example.args = {
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
