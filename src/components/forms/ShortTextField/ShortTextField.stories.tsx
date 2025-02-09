import { ShortTextField, type ShortTextFieldProps } from "@/components/forms";
import type { Meta } from "@storybook/react";

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
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
