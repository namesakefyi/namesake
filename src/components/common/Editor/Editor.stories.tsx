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
    initialContent: `
      <h2>This is a heading (insert with ##)</h2>
      <p>This is a paragraph. Text can be marked <strong>bold</strong> or <em>italic</em>.</p>
      <p>You can also <a href="https://www.mass.gov/">link to other pages</a>.</p>
      <blockquote>
        <p>This is a blockquote. Insert with >.</p>
      </blockquote>
      <h3>This is a subheading (insert with ###)</h3>
      <ul>
        <li>This is</li>
        <li>an <strong>unordered</strong></li>
        <li>list</li>
      </ul>
      <ol>
        <li>This is</li>
        <li>an <strong>ordered</strong></li>
        <li>list</li>
      </ol>  
    `,
  },
};

export const FewerControls: Story = {
  args: {
    extensions: ["basic"],
    initialContent:
      "This editor only allows basic formatting. Even if you try to get around it (like adding a header with `##`), it won't let you.",
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

export const WithButton: Story = {
  args: {
    initialContent: `<p>Buttons can be included to draw attention to important links.</p>
      <a href="https://www.mass.gov/" data-type="button">Go to Mass.gov</a>
      <p>When first inserted, buttons will not have an href. Click the button to add one.</p>
      <a href="" data-type="button">Click here</a>
    `,
  },
};

export const WithDisclosure: Story = {
  args: {
    initialContent: `
      <aside data-type="disclosures">
        <details data-type="disclosure">
          <summary data-type="disclosure-title">Disclosure Title</summary>
          <div data-type="disclosure-content">
            <p>This is the content of the disclosure.</p>
          </div>
        </details>
      </aside>
    `,
  },
};
