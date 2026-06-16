import type { Meta } from "@storybook/react-vite";
import { YesNoField, type YesNoFieldProps } from "./YesNoField";

const meta: Meta<typeof YesNoField> = {
  component: YesNoField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: YesNoFieldProps) => <YesNoField {...args} />;

Example.args = {
  label: "Custom field",
  name: "customField",
  description: "A custom description",
  children: <div>Children</div>,
};
