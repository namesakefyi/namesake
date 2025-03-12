import { PhoneField, type PhoneFieldProps } from "@/components/forms";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof PhoneField> = {
  component: PhoneField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: PhoneFieldProps) => <PhoneField {...args} />;

Example.args = {
  name: "phoneNumber",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
