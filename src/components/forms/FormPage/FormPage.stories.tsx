import type { Meta } from "@storybook/react";
import { FormPage, type FormPageProps } from ".";

const meta: Meta<typeof FormPage> = {
  component: FormPage,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: FormPageProps) => <FormPage {...args} />;

Example.args = {
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
