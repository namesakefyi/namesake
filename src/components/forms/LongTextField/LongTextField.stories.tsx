import type { Meta } from "@storybook/react-vite";
import { LongTextField, type LongTextFieldProps } from "@/components/forms";

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
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
