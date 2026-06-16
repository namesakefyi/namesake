import type { Meta } from "@storybook/react-vite";
import {
  CheckboxGroupField,
  type CheckboxGroupFieldProps,
} from "./CheckboxGroupField";

const meta: Meta<typeof CheckboxGroupField> = {
  component: CheckboxGroupField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: CheckboxGroupFieldProps) => (
  <CheckboxGroupField {...args} />
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
