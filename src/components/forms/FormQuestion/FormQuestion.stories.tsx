import type { Meta } from "@storybook/react";
import { FormQuestion, type FormQuestionProps } from ".";

const meta: Meta<typeof FormQuestion> = {
  component: FormQuestion,
  argTypes: {
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
  },
};

export default meta;

export const Example = (args: FormQuestionProps) => <FormQuestion {...args} />;

Example.args = {
  title: "What is your name?",
  description:
    "This is your current legal name, exactly as it appears on your ID.",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
