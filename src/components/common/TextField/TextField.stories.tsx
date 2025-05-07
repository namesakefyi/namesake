import { Button, Form, TextField } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof TextField> = {
  component: TextField,

  args: {
    label: "Name",
  },
};

export default meta;

export const Example = (args: any) => <TextField {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <TextField {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
