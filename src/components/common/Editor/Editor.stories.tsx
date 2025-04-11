import type { Meta, StoryObj } from "@storybook/react";

import { Editor } from "./Editor";

const meta = {
  component: Editor,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Editor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialContent: "Hello, girls!",
  },
};

export const WithSteps: Story = {
  args: {
    initialContent: `
      <ol data-type="steps">
        <li data-type="step-item">
          <div data-type="step-title">First Step</div>
          <div data-type="step-content">
            <p>This is the first step. Here's what you need to do.</p>
          </div>
        </li>
        <li data-type="step-item">
          <div data-type="step-title">Second Step</div>
          <div data-type="step-content">
            <p>This is the second step with more details.</p>
            <p>You can add multiple paragraphs here.</p>
          </div>
        </li>
        <li data-type="step-item">
          <div data-type="step-title">Final Step</div>
          <div data-type="step-content">
            <p>Finish up with this last task.</p>
          </div>
        </li>
      </ol>
    `,
  },
};

export const Simplified: Story = {
  args: {
    extensions: ["basic"],
    initialContent:
      "This editor only allows basic formatting. Even if you try to get around it (like adding a header with `##`), it won't let you.",
  },
};

export const WithButton: Story = {
  args: {
    initialContent: `
      <a href="https://www.mass.gov/" data-type="button">Go to Mass.gov</a>
    `,
  },
};
