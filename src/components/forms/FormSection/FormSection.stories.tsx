import { FormSection, type FormSectionProps } from "@/components/forms";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof FormSection> = {
  component: FormSection,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: FormSectionProps) => <FormSection {...args} />;

Example.args = {
  title: "Form Section",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
