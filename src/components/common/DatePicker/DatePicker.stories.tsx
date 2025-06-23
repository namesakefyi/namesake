import type { Meta } from "@storybook/react-vite";
import { Button, DatePicker, Form } from "@/components/common";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,

  args: {
    label: "Event date",
  },
};

export default meta;

export const Example = (args: any) => <DatePicker {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <DatePicker {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
