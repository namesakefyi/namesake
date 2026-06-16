import type { Meta } from "@storybook/react-vite";
import { Button } from "../Button";
import { Form } from "../Form";
import { TextArea } from "./TextArea";

const meta = {
  component: TextArea,
  args: {
    label: "Bio",
  },
} satisfies Meta<typeof TextArea>;

export default meta;

export const Example = (args: any) => <TextArea {...args} />;

export const Validation = (args: any) => (
  <Form>
    <TextArea {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
