import { RadioGroupField, type RadioGroupFieldProps } from "@/components/forms";
import type { Meta } from "@storybook/react-vite";

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
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
