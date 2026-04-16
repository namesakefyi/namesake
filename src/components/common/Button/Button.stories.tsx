import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import type { Meta, StoryFn } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof Button>;

export const Secondary: Story = (args) => <Button {...args}>Press me</Button>;

Secondary.args = {
  onPress: () => alert("Hello world!"),
};

export const Primary: Story = (args) => <Button {...args}>Press me</Button>;

Primary.args = {
  variant: "primary",
  onPress: () => alert("Hello world!"),
};

export const Disabled: Story = (args) => (
  <Button {...args}>Disabled button</Button>
);

Disabled.args = {
  isDisabled: true,
};

export const PrimaryDisabled: Story = (args) => (
  <Button {...args}>Disabled button</Button>
);

PrimaryDisabled.args = {
  variant: "primary",
  isDisabled: true,
};

export const Pending: Story = (args) => <Button {...args}>Save changes</Button>;

Pending.args = {
  isPending: true,
};

export const PrimaryPending: Story = (args) => (
  <Button {...args}>Save changes</Button>
);

PrimaryPending.args = {
  variant: "primary",
  isPending: true,
};

export const IconOnly: Story = (args) => <Button {...args} />;

IconOnly.args = {
  icon: RiArrowLeftLine,
};

export const StartIcon: Story = (args) => <Button {...args}>Go back</Button>;

StartIcon.args = {
  icon: RiArrowLeftLine,
};

export const EndIcon: Story = (args) => <Button {...args}>Next</Button>;

EndIcon.args = {
  endIcon: RiArrowRightLine,
};

export const Large: Story = (args) => <Button {...args}>Large button</Button>;

Large.args = {
  size: "large",
};

export const LargePrimary: Story = (args) => (
  <Button {...args}>Large primary</Button>
);

LargePrimary.args = {
  variant: "primary",
  size: "large",
  endIcon: RiArrowRightLine,
};
