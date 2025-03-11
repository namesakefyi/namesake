import type { Meta } from "@storybook/react";
import { HiddenText } from "./HiddenText";

const meta: Meta<typeof HiddenText> = {
  component: HiddenText,
};

export default meta;

export const Example = (args: any) => (
  <p>
    This is a <HiddenText {...args}>secret</HiddenText> message.
  </p>
);

export const LongText = (args: any) => (
  <p>
    This is a{" "}
    <HiddenText {...args}>
      long secret which wraps to multiple lines and should reflow across the
      page
    </HiddenText>
    .
  </p>
);
