import type { Meta } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";
import { FormReviewStep, type FormReviewStepProps } from "./FormReviewStep";

const meta: Meta<typeof FormReviewStep> = {
  component: FormReviewStep,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      const form = useForm();
      return (
        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Story />
          </form>
        </FormProvider>
      );
    },
  ],
};

export default meta;

export const Default = (args: FormReviewStepProps) => (
  <FormReviewStep {...args} />
);

Default.args = {};

export const WithCustomTitle = (args: FormReviewStepProps) => (
  <FormReviewStep {...args} />
);

WithCustomTitle.args = {
  title: "Confirm details",
  description:
    "Please double-check all information before submitting. You won't be able to edit these details after submission.",
};

export const WithoutDescription = (args: FormReviewStepProps) => (
  <FormReviewStep {...args} />
);

WithoutDescription.args = {
  title: "Review your information",
  description: undefined,
};
