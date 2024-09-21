import type { Meta } from "@storybook/react";
import { DateField } from ".";
import { Button } from "../Button";
import { Form } from "../Form";

const meta: Meta<typeof DateField> = {
  component: DateField,

  args: {
    label: "Event date",
  },
};

export default meta;

export const Example = (args: any) => <DateField {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <DateField {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
