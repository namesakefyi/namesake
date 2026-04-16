import type { Meta, StoryFn } from "@storybook/react";
import { Banner } from ".";

const meta: Meta<typeof Banner> = {
  component: Banner,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
};

export default meta;
type Story = StoryFn<typeof Banner>;

export const Info: Story = (args) => (
  <Banner variant="info" {...args}>
    This is an informational message to help guide the user.
  </Banner>
);

export const Success: Story = (args) => (
  <Banner variant="success" {...args}>
    Your changes have been saved successfully!
  </Banner>
);

export const Warning: Story = (args) => (
  <Banner variant="warning" {...args}>
    This action cannot be undone. Please review before proceeding.
  </Banner>
);

export const ErrorMessage: Story = (args) => (
  <Banner variant="error" {...args}>
    An error occurred while processing your request. Please try again.
  </Banner>
);
