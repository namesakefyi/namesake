import type { Meta } from "@storybook/react";
import { RadioGroupField, type RadioGroupFieldProps } from ".";

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
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
