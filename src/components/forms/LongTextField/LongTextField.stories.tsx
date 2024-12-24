import type { Meta } from "@storybook/react";
import { LongTextField, type LongTextFieldProps } from ".";

const meta: Meta<typeof LongTextField> = {
  component: LongTextField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: LongTextFieldProps) => (
  <LongTextField {...args} />
);

Example.args = {
  label: "Free text",
  name: "freeText",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
