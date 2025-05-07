import { Button, DateField, Form, TextField } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof Form> = {
  component: Form,
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
