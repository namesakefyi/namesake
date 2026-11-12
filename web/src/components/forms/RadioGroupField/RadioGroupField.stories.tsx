import type { Meta } from "@storybook/react-vite";
import { RadioGroupField, type RadioGroupFieldProps } from "./RadioGroupField";

const meta: Meta<typeof RadioGroupField> = {
  component: RadioGroupField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: RadioGroupFieldProps) => (
  <RadioGroupField {...args} />
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
