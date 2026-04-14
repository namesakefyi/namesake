import type { Meta, StoryFn } from "@storybook/react";
import { FormStepContext } from "../FormContainer";
import { FormNavigation } from ".";

const meta: Meta<typeof FormNavigation> = {
  component: FormNavigation,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryFn<typeof FormNavigation>;

export const FirstStep: Story = () => (
  <FormStepContext.Provider
    value={{
      onNext: () => console.log("Next clicked"),
      onBack: () => console.log("Back clicked"),
      formTitle: "Massachusetts Court Order",
      currentStepIndex: 1, // First actual step
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
    <FormNavigation />
  </FormStepContext.Provider>
);

export const MiddleStep: Story = () => (
  <FormStepContext.Provider
    value={{
      onNext: () => console.log("Next clicked"),
      onBack: () => console.log("Back clicked"),
      formTitle: "Massachusetts Court Order",
      currentStepIndex: 3, // Third actual step
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
    <FormNavigation />
  </FormStepContext.Provider>
);

export const LastStep: Story = () => (
  <FormStepContext.Provider
    value={{
      onNext: () => console.log("Next clicked"),
      onBack: () => console.log("Back clicked"),
      formTitle: "Massachusetts Court Order",
      currentStepIndex: 5, // Last actual step
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
    <FormNavigation />
  </FormStepContext.Provider>
);

export const ReviewStep: Story = () => (
  <FormStepContext.Provider
    value={{
      onNext: () => console.log("Next clicked (disabled)"),
      onBack: () => console.log("Back clicked"),
      formTitle: "Massachusetts Court Order",
      currentStepIndex: 0,
      totalSteps: 5,
      phase: "review",
      onSubmit: (e) => {
        e.preventDefault();
        console.log("Submit clicked");
      },
      onEditStep: () => {},
      submitError: null,
    }}
  >
    <FormNavigation />
  </FormStepContext.Provider>
);

export const LongTitle: Story = () => (
  <FormStepContext.Provider
    value={{
      onNext: () => console.log("Next clicked"),
      onBack: () => console.log("Back clicked"),
      formTitle:
        "Court-Ordered Name Change Application for the Commonwealth of Massachusetts",
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
    <FormNavigation />
  </FormStepContext.Provider>
);
