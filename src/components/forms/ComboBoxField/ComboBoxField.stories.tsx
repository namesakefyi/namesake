import type { Meta } from "@storybook/react-vite";
import { SelectField, type SelectFieldProps } from "@/components/forms";

const meta: Meta<typeof SelectField> = {
  component: SelectField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: SelectFieldProps) => <SelectField {...args} />;

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
