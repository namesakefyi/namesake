import type { Meta } from "@storybook/react";
import { EmailField, type EmailFieldProps } from ".";

const meta: Meta<typeof EmailField> = {
  component: EmailField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: EmailFieldProps) => <EmailField {...args} />;

Example.args = {
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
