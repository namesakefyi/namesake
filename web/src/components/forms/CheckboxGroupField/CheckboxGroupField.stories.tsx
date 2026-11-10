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
  options: {
    "option-1": "Option 1",
    "option-2": "Option 2",
    "option-3": "Option 3",
  },
  children: <div>Children</div>,
};
