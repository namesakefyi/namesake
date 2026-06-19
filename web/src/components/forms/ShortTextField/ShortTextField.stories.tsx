import type { Meta } from "@storybook/react-vite";
import { ShortTextField, type ShortTextFieldProps } from "./ShortTextField";

const meta: Meta<typeof ShortTextField> = {
  component: ShortTextField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: ShortTextFieldProps) => (
  <ShortTextField {...args} />
);

Example.args = {
  label: "Custom field",
  name: "customField",
  description: "A custom description",
  children: <div>Children</div>,
};
