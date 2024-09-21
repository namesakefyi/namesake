import type { Meta } from "@storybook/react";
import { Form } from ".";
import { Button } from "../Button";
import { DateField } from "../DateField";
import { TextField } from "../TextField";

const meta: Meta<typeof Form> = {
  component: Form,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Example = (args: any) => (
  <Form {...args}>
    <TextField label="Email" name="email" type="email" isRequired />
    <DateField label="Birth date" isRequired />
    <div className="flex gap-2">
      <Button type="submit">Submit</Button>
      <Button type="reset" variant="secondary">
        Reset
      </Button>
    </div>
  </Form>
);
