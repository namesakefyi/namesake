import type { Meta } from "@storybook/react";
import { TimeField } from ".";
import { Button } from "../Button";
import { Form } from "../Form";

const meta: Meta<typeof TimeField> = {
  component: TimeField,
  parameters: {
    layout: "centered",
  },

  args: {
    label: "Event time",
  },
};

export default meta;

export const Example = (args: any) => <TimeField {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <TimeField {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
