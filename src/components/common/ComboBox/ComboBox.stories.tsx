import type { Meta } from "@storybook/react-vite";
import {
  Button,
  ComboBox,
  ComboBoxItem,
  ComboBoxSection,
  Form,
} from "@/components/common";

const meta: Meta<typeof ComboBox> = {
  component: ComboBox,

  args: {
    label: "Ice cream flavor",
    placeholder: "Select a flavor",
  },
};

export default meta;

export const Example = (args: any) => (
  <ComboBox {...args}>
    <ComboBoxItem>Chocolate</ComboBoxItem>
    <ComboBoxItem id="mint">Mint</ComboBoxItem>
    <ComboBoxItem>Strawberry</ComboBoxItem>
    <ComboBoxItem>Vanilla</ComboBoxItem>
  </ComboBox>
);

export const DisabledItems = (args: any) => <Example {...args} />;
DisabledItems.args = {
  disabledKeys: ["mint"],
};

export const Sections = (args: any) => (
  <ComboBox {...args}>
    <ComboBoxSection title="Fruit">
      <ComboBoxItem id="Apple">Apple</ComboBoxItem>
      <ComboBoxItem id="Banana">Banana</ComboBoxItem>
      <ComboBoxItem id="Orange">Orange</ComboBoxItem>
      <ComboBoxItem id="Honeydew">Honeydew</ComboBoxItem>
      <ComboBoxItem id="Grapes">Grapes</ComboBoxItem>
      <ComboBoxItem id="Watermelon">Watermelon</ComboBoxItem>
      <ComboBoxItem id="Cantaloupe">Cantaloupe</ComboBoxItem>
      <ComboBoxItem id="Pear">Pear</ComboBoxItem>
    </ComboBoxSection>
    <ComboBoxSection title="Vegetable">
      <ComboBoxItem id="Cabbage">Cabbage</ComboBoxItem>
      <ComboBoxItem id="Broccoli">Broccoli</ComboBoxItem>
      <ComboBoxItem id="Carrots">Carrots</ComboBoxItem>
      <ComboBoxItem id="Lettuce">Lettuce</ComboBoxItem>
      <ComboBoxItem id="Spinach">Spinach</ComboBoxItem>
      <ComboBoxItem id="Bok Choy">Bok Choy</ComboBoxItem>
      <ComboBoxItem id="Cauliflower">Cauliflower</ComboBoxItem>
      <ComboBoxItem id="Potatoes">Potatoes</ComboBoxItem>
    </ComboBoxSection>
  </ComboBox>
);

Sections.args = {
  label: "Preferred fruit or vegetable",
};

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <Example {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
