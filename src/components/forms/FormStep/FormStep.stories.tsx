import type { Meta } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormStep, type FormStepProps } from "./FormStep";

const meta: Meta<typeof FormStep> = {
  component: FormStep,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      const form = useForm();
      return (
        <FormProvider {...form}>
          <FormStepContext.Provider
            value={{
              onNext: () => console.log("Next clicked"),
              onBack: () => console.log("Back clicked"),
              formTitle: "Massachusetts Court Order",
              currentStepIndex: 2,
              totalSteps: 5,
              phase: "filling",
              onSubmit: (e) => {
                e.preventDefault();
                console.log("Submit clicked");
              },
              onEditStep: () => {},
              submitError: null,
            }}
          >
            <Story />
          </FormStepContext.Provider>
        </FormProvider>
      );
    },
  ],
};

export default meta;

export const Example = (args: FormStepProps) => <FormStep {...args} />;

Example.args = {
  stepConfig: {
    id: "legal-name",
    title: "What is your current legal name?",
    fields: ["oldFirstName", "oldLastName"],
    component: () => null,
  },
  children: <div>Children</div>,
};

export const WithDescription = (args: FormStepProps) => <FormStep {...args} />;

WithDescription.args = {
  stepConfig: {
    id: "legal-name",
    title: "What is your current legal name?",
    description: "Type your name exactly as it appears on your ID.",
    fields: ["oldFirstName", "oldLastName"],
    component: () => null,
  },
  children: <div>Children</div>,
};
