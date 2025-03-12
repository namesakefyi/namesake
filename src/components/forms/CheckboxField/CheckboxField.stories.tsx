import { CheckboxField, type CheckboxFieldProps } from "@/components/forms";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof CheckboxField> = {
  component: CheckboxField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: CheckboxFieldProps) => (
  <CheckboxField {...args} />
);

Example.args = {
  name: "shouldReturnOriginalDocuments",
  label: "I would like my documents returned",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
