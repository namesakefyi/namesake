import type { Meta } from "@storybook/react-vite";
import { PhoneField, type PhoneFieldProps } from "@/components/forms";

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
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
