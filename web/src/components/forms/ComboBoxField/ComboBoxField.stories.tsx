import type { Meta } from "@storybook/react-vite";
import { ComboBoxField, type ComboBoxFieldProps } from "./ComboBoxField";

const meta: Meta<typeof ComboBoxField> = {
  component: ComboBoxField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: ComboBoxFieldProps) => (
  <ComboBoxField {...args} />
);

Example.args = {
  label: "Select an option",
  name: "option",
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
  children: <div>Children</div>,
};
