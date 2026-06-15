import type { Meta } from "@storybook/react-vite";
import type { Step } from "#lib/forms/types";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormReviewStep, type FormReviewStepProps } from "./FormReviewStep";

const mockSteps: Step[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    fields: ["oldFirstName", "oldLastName"],
    component: () => null,
  },
  {
    id: "contact",
    title: "Contact Details",
    fields: ["email"],
    component: () => null,
  },
];

const meta: Meta<typeof FormReviewStep> = {
  component: FormReviewStep,
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
          currentStepIndex: 0,
          totalSteps: 3,
          phase: "review",
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

export const Default = (args: FormReviewStepProps) => (
  <FormReviewStep {...args} />
);

Default.args = {
  steps: mockSteps,
};

export const WithSubmitError = (args: FormReviewStepProps) => (
  <FormReviewStep {...args} />
);

WithSubmitError.args = {
  steps: mockSteps,
};

WithSubmitError.decorators = [
  (Story: React.ComponentType) => (
    <FormStepContext.Provider
      value={{
        onNext: () => {},
        onBack: () => {},
        formTitle: "Massachusetts Court Order",
        currentStepIndex: 0,
        totalSteps: 3,
        phase: "review",
        onSubmit: (e) => e.preventDefault(),
        onEditStep: () => {},
        submitError: "Something went wrong. Please try again.",
      }}
    >
      <Story />
    </FormStepContext.Provider>
  ),
];
