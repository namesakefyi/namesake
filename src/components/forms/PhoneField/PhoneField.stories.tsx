import type { Meta } from "@storybook/react-vite";
import { PhoneField, type PhoneFieldProps } from "./PhoneField";

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
  children: <div>Children</div>,
};
