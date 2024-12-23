import type { Meta } from "@storybook/react";
import { EmailField } from ".";

const meta: Meta<typeof EmailField> = {
  component: EmailField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: any) => <EmailField {...args} />;

Example.args = {
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
