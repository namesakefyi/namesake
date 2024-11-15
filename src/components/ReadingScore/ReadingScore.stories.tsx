import type { Meta, StoryObj } from "@storybook/react";

import { ReadingScore } from "./ReadingScore";

const meta = {
  component: ReadingScore,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ReadingScore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Playing games has always been thought to be important to the development of well-balanced and creative children; however, what part, if any, they should play in the lives of adults has never been researched that deeply. I believe that playing games is every bit as important for adults as for children. Not only is taking time out to play games with our children and other adults valuable to building interpersonal relationships but is also a wonderful way to release built up tension.",
  },
};
