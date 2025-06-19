import { EmailField, type EmailFieldProps } from "@/components/forms";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof EmailField> = {
  component: EmailField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: EmailFieldProps) => <EmailField {...args} />;

Example.args = {
  name: "email",
  children: (
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
