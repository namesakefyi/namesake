import type { Meta } from "@storybook/react-vite";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormStep, type FormStepProps } from "./FormStep";

const meta: Meta<typeof FormStep> = {
  component: FormStep,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <FormStepContext.Provider
        value={{
          onNext: () => console.log("Next clicked"),
          onBack: () => console.log("Back clicked"),
          formTitle: "Massachusetts Court Order",
          currentStepIndex: 2, // Step 2 of actual steps
          totalSteps: 5, // 5 actual steps
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
    ),
  ],
};

export default meta;

export const Example = (args: FormStepProps) => <FormStep {...args} />;

Example.args = {
  title: "What is your current legal name?",
  children: <div>Children</div>,
};

export const WithDescription = (args: FormStepProps) => <FormStep {...args} />;

WithDescription.args = {
  title: "What is your current legal name?",
  description: "Type your name exactly as it appears on your ID.",
  children: <div>Children</div>,
};
