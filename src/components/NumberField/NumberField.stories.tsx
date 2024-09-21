import type { Meta } from "@storybook/react";
import { NumberField } from ".";
import { Button } from "../Button";
import { Form } from "../Form";

const meta: Meta<typeof NumberField> = {
  component: NumberField,

  args: {
    label: "Cookies",
  },
};

export default meta;

export const Example = (args: any) => <NumberField {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <NumberField {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
