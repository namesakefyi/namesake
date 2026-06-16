import type { Meta } from "@storybook/react-vite";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormTitleStep, type FormTitleStepProps } from "./FormTitleStep";

const meta: Meta<typeof FormTitleStep> = {
  component: FormTitleStep,
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
          currentStepIndex: 0, // Title step
          totalSteps: 5, // 5 actual steps
          phase: "title",
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

const sharedArgs = {
  title: "Massachusetts Name Change Petition",
  description:
    "This guided form will help you complete your name change paperwork.",
  onStart: () => console.log("Start clicked"),
  pdfs: [
    {
      pdfId: "cjp27-petition-to-change-name-of-adult" as const,
      title: "Petition to Change Name of Adult",
      code: "CJP-27",
    },
  ],
  totalSteps: 5,
};

export const Example = (args: FormTitleStepProps) => (
  <FormTitleStep {...args} />
);

Example.args = {
  ...sharedArgs,
};

export const WithChildren = (args: FormTitleStepProps) => (
  <FormTitleStep {...args} />
);

WithChildren.args = {
  ...sharedArgs,
  children: (
    <div>
      <p>
        <strong>What you'll need:</strong>
      </p>
      <ul>
        <li>Your current legal name</li>
        <li>Your desired new name</li>
        <li>Your contact information</li>
        <li>Your birthplace and date of birth</li>
      </ul>
    </div>
  ),
};
