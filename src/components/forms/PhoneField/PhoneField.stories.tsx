import { PhoneField, type PhoneFieldProps } from "@/components/forms";
import type { Meta } from "@storybook/react-vite";

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
